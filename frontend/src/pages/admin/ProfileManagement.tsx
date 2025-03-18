import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import { Permission } from "../../types/Permission";
import { Profile } from "../../types/Profile";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [{ value: "name", label: "Nome" }];

const ProfileManagement: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<Profile[]>([]);
    const [submitType, setSubmitType] = useState<"add" | "update" | "delete" | "">("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentProfile, setCurrentProfile] = useState<Profile>({
        id: "",
        name: "",
    });

    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
        ticket: { create: false, edit: false, view: false, delete: false },
        ticketCategory: { create: false, edit: false, view: false, delete: false },
        unit: { create: false, edit: false, view: false, delete: false },
        department: { create: false, edit: false, view: false, delete: false },
        message: { create: false, view: false },
        user: { create: false, edit: false, view: false, delete: false },
        profile: { create: false, edit: false, view: false, delete: false },
    });

    const mapPermissions = (apiPermissions: { name: string }[]) => {
        const defaultPermissions: Record<string, Record<string, boolean>> = {
            ticket: { create: false, edit: false, view: false, delete: false },
            ticketCategory: { create: false, edit: false, view: false, delete: false },
            unit: { create: false, edit: false, view: false, delete: false },
            department: { create: false, edit: false, view: false, delete: false },
            message: { create: false, view: false },
            user: { create: false, edit: false, view: false, delete: false },
            profile: { create: false, edit: false, view: false, delete: false },
        };

        apiPermissions.forEach(({ name }) => {
            const parts = name.split("_");
            if (parts.length > 1) {
                const action = parts[0].toLowerCase() as keyof Permission;
                const entity = parts
                    .slice(1)
                    .map((word, index) =>
                        index === 0
                            ? word.toLowerCase()
                            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join("") as keyof Permissions;

                if (defaultPermissions[entity] && action in defaultPermissions[entity]) {
                    defaultPermissions[entity][action] = true;
                }
            }
        });

        return defaultPermissions;
    };

    const reverseMapPermissions = (permissions: Record<string, Record<string, boolean>>) => {
        const apiPermissions: { name: string }[] = [];

        Object.entries(permissions).forEach(([entity, actions]) => {
            Object.entries(actions).forEach(([action, allowed]) => {
                if (allowed) {
                    const formattedEntity = entity.replace(/([A-Z])/g, "_$1").toUpperCase();
                    apiPermissions.push({ name: `${action.toUpperCase()}_${formattedEntity}` });
                }
            });
        });

        return apiPermissions;
    };
    const fetchData = async () => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/profiles/pageable?page=${currentPage}&size=${pageSize}`
            );
            if (res.status === 200) {
                setData(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action: string, mode: string, id?: string) => {
        setModalTitle(`${action} Perfil`);
        setModeModal(mode);

        if (mode !== "add" && id) {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/profiles/${id}`);
                if (res.status === 200) {
                    setCurrentProfile({ id: res.data.id, name: res.data.name });
                    if (res.data.permissions) {
                        setPermissions(mapPermissions(res.data.permissions));
                    }
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentProfile({ id: "", name: "" });
        }
    };

    const handleCheckboxChange = (entity: string, action: string) => {
        setPermissions((prevPermissions) => ({
            ...prevPermissions,
            [entity]: {
                ...prevPermissions[entity],
                [action]: !prevPermissions[entity][action],
            },
        }));
    };

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);
    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(0);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentProfile({ ...currentProfile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formattedPermissions = reverseMapPermissions(permissions);
            const payload = { ...currentProfile, permissions: formattedPermissions };

            let res;
            if (submitType === "delete") {
                res = await axiosInstance.delete(`${API_BASE_URL}/profiles/${currentProfile.id}`);
            } else if (submitType === "add") {
                res = await axiosInstance.post(`${API_BASE_URL}/profiles/`, payload);
            } else if (submitType === "update") {
                res = await axiosInstance.put(
                    `${API_BASE_URL}/profiles/${currentProfile.id}`,
                    payload
                );
            } else {
                console.error("Invalid submit type");
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentProfile({ id: "", name: "" });
                window.location.reload();
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <div className="container">
                <ActionBar
                    modalTargetId="modal"
                    delEntityEndPoint={`${API_BASE_URL}/profiles`}
                    onCreate={() => handleModalOpen("Criar", "add")}
                    onFilterChange={handleFilterChange}
                    filterText={filterText}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                />
                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <div className="modal fade" id="modal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="title_modal">
                                {modalTitle}
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                {modeModal != "delete" && (
                                    <>
                                        <div>
                                            <label htmlFor="name" className="form-label">
                                                Nome
                                            </label>
                                            <input
                                                name="name"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentProfile.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Entidade</th>
                                                        <th>Criar</th>
                                                        <th>Editar</th>
                                                        <th>Ver</th>
                                                        <th>Deletar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(permissions).map(([entity, actions]) => {
                                                        const allPermissions = ["create", "edit", "view", "delete"]; // Permissões padrão
                                                        return (
                                                            <tr key={entity}>
                                                                <td>{entity.toUpperCase()}</td>
                                                                {allPermissions.map((permission) => (
                                                                    <td key={permission}>
                                                                        {actions[permission] !== undefined ? ( // Verifica se a permissão existe
                                                                            <input
                                                                                disabled={modeModal === "readonly"}
                                                                                type="checkbox"
                                                                                checked={actions[permission]}
                                                                                onChange={() => handleCheckboxChange(entity, permission)}
                                                                            />
                                                                        ) : (
                                                                            <span>-</span> // Exibe um traço se a permissão não existir
                                                                        )}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {modeModal === "delete" && (
                                    <>Deseja excluir o perfil {currentProfile.name}?</>
                                )}
                            </div>
                            <div className="modal-footer">
                                {modeModal === "update" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType("update")}
                                    >
                                        Atualizar
                                    </button>
                                )}
                                {modeModal === "add" && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={() => setSubmitType("add")}
                                    >
                                        Criar
                                    </button>
                                )}
                                {modeModal === "delete" && (
                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                        onClick={() => setSubmitType("delete")}
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfileManagement;
