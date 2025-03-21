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
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [currentProfile, setCurrentProfile] = useState<Profile>({
        id: "",
        name: "",
        permissions: []
    });

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

    const fetchPermissions = async () => {
        try {
            const res = await axiosInstance.get(
                `${API_BASE_URL}/permissions`
            );

            if (res.status === 200) {
                setPermissions(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
        fetchPermissions();
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action: string, mode: string, id?: string) => {
        setModalTitle(`${action} Perfil`);
        setModeModal(mode);

        if (mode !== "add" && id) {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/profiles/${id}`);
                if (res.status === 200) {
                    setCurrentProfile({
                        id: res.data.id,
                        name: res.data.name,
                        permissions: res.data.permissions || [],
                    });
                } else {
                    console.error("Error", res.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentProfile({ id: "", name: "", permissions: [] });
        }
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
            const payload = {
                ...currentProfile,
                permissions: currentProfile.permissions,
            };

            let res;
            if (submitType === "delete") {
                res = await axiosInstance.delete(`${API_BASE_URL}/profiles/${currentProfile.id}`);
            } else if (submitType === "add") {
                res = await axiosInstance.post(`${API_BASE_URL}/profiles`, payload);
            } else if (submitType === "update") {
                res = await axiosInstance.put(`${API_BASE_URL}/profiles/${currentProfile.id}`, payload);
            } else {
                console.error("Invalid submit type");
                return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentProfile({ id: "", name: "", permissions: [] });
                window.location.reload();
            } else {
                console.error("Error", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePermissionToggle = (permission: Permission) => {
        setCurrentProfile((prevProfile) => {
            const hasPermission = prevProfile.permissions?.some((p) => p.id === permission.id);

            return {
                ...prevProfile,
                permissions: hasPermission
                    ? prevProfile.permissions?.filter((p) => p.id !== permission.id)
                    : [...(prevProfile.permissions || []), permission],
            };
        });
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
                                                        <th>Habilitar</th>
                                                        <th>Permissão</th>
                                                        <th>Descrição</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {permissions.map((permission) => (
                                                        <tr key={permission.id}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={currentProfile.permissions?.some((p) => p.id === permission.id) || false}
                                                                    onChange={() => handlePermissionToggle(permission)}
                                                                    disabled={modeModal === "readonly"}
                                                                />
                                                            </td>
                                                            <td id={permission.id}>{permission.name}</td>
                                                            <td>{permission.description}</td>
                                                        </tr>
                                                    ))}
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
