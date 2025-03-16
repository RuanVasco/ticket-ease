import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axiosInstance from "../../components/AxiosConfig";
import Select from "react-select";
import Table from "../../components/Table";
import ActionBar from "../../components/ActionBar";
import Pagination from "../../components/Pagination";
import { FaUserMinus, FaUserPlus } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: { id: string; name: string };
    cargo: { id: string; name: string };
    profiles: { id: string; name: string }[];
    password: string;
}

interface SelectOption {
    id: string;
    name: string;
}

const columns = [
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
    { value: "department.name", label: "Setor" },
    { value: "cargo.name", label: "Cargo" },
];

const UserManagement: React.FC = () => {
    const [filterText, setFilterText] = useState<string>("");
    const [modeModal, setModeModal] = useState<string>("");
    const [modalTitle, setModalTitle] = useState<string>("");
    const [data, setData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [submitType, setSubmitType] = useState<string>("");

    const [currentUser, setCurrentUser] = useState<User>({
        id: "",
        name: "",
        email: "",
        phone: "",
        department: { id: "", name: "" },
        cargo: { id: "", name: "" },
        profiles: [],
        password: "",
    });

    const [cargos, setCargos] = useState<SelectOption[]>([]);
    const [departments, setDepartments] = useState<SelectOption[]>([]);
    const [profiles, setProfiles] = useState<SelectOption[]>([]);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                const res = await axiosInstance.get(
                    `${API_BASE_URL}/users/pageable?page=${currentPage}&size=${pageSize}`
                );
                if (res.status === 200) {
                    setData(res.data.content);
                    setTotalPages(res.data.totalPages);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchOptions = async (
            endpoint: string,
            setState: React.Dispatch<React.SetStateAction<SelectOption[]>>
        ) => {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/${endpoint}/`);
                if (res.status === 200) {
                    setState(
                        res.data.map((item: { id: string; name: string }) => ({
                            value: item.id,
                            label: item.name,
                        }))
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsersData();
        fetchOptions("cargos", setCargos);
        fetchOptions("departments", setDepartments);
        fetchOptions("profiles", setProfiles);
    }, [currentPage, pageSize]);

    const handleModalOpen = async (action: string, mode: string, idUser?: string) => {
        setModalTitle(`${action} Usuário`);
        setModeModal(mode);

        if (mode !== "add" && idUser) {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/users/${idUser}`);
                if (res.status === 200) {
                    setCurrentUser({
                        id: res.data.id,
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.phone ?? "",
                        department: {
                            id: res.data.department?.id ?? "",
                            name: res.data.department?.name ?? "",
                        },
                        cargo: {
                            id: res.data.cargo?.id ?? "",
                            name: res.data.cargo?.name ?? "",
                        },
                        profiles: res.data.roles ?? [],
                        password: "",
                    });
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setCurrentUser({
                id: "",
                name: "",
                email: "",
                phone: "",
                department: { id: "", name: "" },
                cargo: { id: "", name: "" },
                profiles: [],
                password: "",
            });
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "department") {
            setCurrentUser((prev) => ({
                ...prev,
                department: { ...prev.department, id: value },
            }));
        } else if (name === "cargo") {
            setCurrentUser((prev) => ({
                ...prev,
                cargo: { ...prev.cargo, id: value },
            }));
        } else {
            setCurrentUser((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            let res;
            const { department, cargo, profiles, ...postData } = currentUser;

            const postDataWithIds = {
                ...postData,
                departmentId: department.id,
                cargoId: cargo.id,
                profiles: profiles.map((profile) => profile.id),
            };

            switch (submitType) {
                case "add":
                    res = await axiosInstance.post(
                        `${API_BASE_URL}/users/register`,
                        postDataWithIds
                    );
                    break;
                case "update":
                    res = await axiosInstance.put(
                        `${API_BASE_URL}/users/${currentUser.id}`,
                        postDataWithIds
                    );
                    break;
                case "delete":
                    res = await axiosInstance.delete(`${API_BASE_URL}/users/${currentUser.id}`);
                    break;
                default:
                    return;
            }

            if (res.status === 200 || res.status === 201) {
                setCurrentUser({
                    id: "",
                    name: "",
                    email: "",
                    phone: "",
                    department: { id: "", name: "" },
                    cargo: { id: "", name: "" },
                    profiles: [],
                    password: "",
                });

                window.location.reload();
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
                    delEntityEndPoint={`${API_BASE_URL}/users`}
                    addIcon={FaUserPlus}
                    removeIcon={FaUserMinus}
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
                <div className="modal-dialog">
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
                                                value={currentUser.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="email" className="form-label">
                                                E-mail
                                            </label>
                                            <input
                                                name="email"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUser.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="phone" className="form-label">
                                                Telefone
                                            </label>
                                            <input
                                                name="phone"
                                                className="form-control"
                                                readOnly={modeModal === "readonly"}
                                                value={currentUser.phone ?? ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="department" className="form-label">
                                                Setor
                                            </label>
                                            <select
                                                className="form-select"
                                                name="department"
                                                id="department"
                                                value={currentUser.department?.id || ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                                required
                                            >
                                                <option value="">----</option>
                                                {departments.map((department) => (
                                                    <option
                                                        key={department.id}
                                                        value={department.id}
                                                    >
                                                        {department.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="cargo" className="form-label">
                                                Cargo
                                            </label>
                                            <select
                                                className="form-select"
                                                name="cargo"
                                                id="cargo"
                                                value={currentUser.cargo?.id ?? ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                            >
                                                <option value="">----</option>
                                                {cargos.map((cargo) => (
                                                    <option key={cargo.id} value={cargo.id}>
                                                        {cargo.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="profile" className="form-label">
                                                Perfis
                                            </label>
                                            <Select
                                                isDisabled={modeModal === "readonly"}
                                                isMulti
                                                name="profile"
                                                id="profile"
                                                value={(currentUser.profiles || []).map(
                                                    (profile) => ({
                                                        value: profile.id,
                                                        label: profile.name,
                                                    })
                                                )}
                                                onChange={(selectedProfiles) => {
                                                    const updatedProfiles = selectedProfiles.map(
                                                        (profile) => ({
                                                            id: profile.value,
                                                            name: profile.label,
                                                        })
                                                    );

                                                    setCurrentUser({
                                                        ...currentUser,
                                                        profiles: updatedProfiles || [],
                                                    });
                                                }}
                                                options={profiles.map((profile) => ({
                                                    value: profile.id,
                                                    label: profile.name,
                                                }))}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                        </div>

                                        {modeModal !== "readonly" && (
                                            <div className="mt-2">
                                                <label htmlFor="password" className="form-label">
                                                    Senha
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    readOnly={modeModal === "readonly"}
                                                    value={currentUser.password}
                                                    onChange={handleInputChange}
                                                    required={modeModal === "add"}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {modeModal === "delete" && (
                                    <>Deseja excluir o usuário {currentUser.name}?</>
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

export default UserManagement;
