import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { FaPlus, FaTrash, FaUserMinus, FaUserPlus } from "react-icons/fa6";

import ActionBar from "../../components/ActionBar";
import axiosInstance from "../../components/AxiosConfig";
import Pagination from "../../components/Pagination";
import PhoneInput from "../../components/Fields/PhoneInput";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionsContext";
import { Cargo } from "../../types/Cargo";
import { Department } from "../../types/Department";
import { Profile } from "../../types/Profile";
import { User } from "../../types/User";
import { toast } from "react-toastify";
import { closeModal } from "../../components/Util/CloseModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const columns = [
    { value: "name", label: "Nome" },
    { value: "email", label: "E-mail" },
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
        cargo: new Cargo(),
        profileDepartments: [
            {
                department: {} as Department,
                role: {} as Profile,
            },
        ],
        password: "",
    });

    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const { hasPermission } = usePermissions();
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    useEffect(() => {
        setCanCreate(hasPermission("CREATE_USER"));
        setCanEdit(hasPermission("EDIT_USER"));
        setCanDelete(hasPermission("DELETE_USER"));
    }, [hasPermission]);

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

    useEffect(() => {
        const fetchOptions = async (
            endpoint: string,
            setState: React.Dispatch<React.SetStateAction<any[]>>
        ) => {
            try {
                const res = await axiosInstance.get(`${API_BASE_URL}/${endpoint}/`);
                if (res.status === 200) {
                    setState(
                        res.data.map((item: { id: string; name: string }) => ({
                            id: item.id,
                            name: item.name,
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
                        cargo: {
                            id: res.data.cargo?.id ?? "",
                            name: res.data.cargo?.name ?? "",
                        },
                        profileDepartments: res.data.roleDepartments ?? [],
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
                cargo: new Cargo(),
                profileDepartments: [
                    {
                        department: { id: "", name: "" } as Department,
                        role: {} as Profile,
                    },
                ],
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

        if (name === "cargo") {
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
            let message;

            const userToSend = {
                name: currentUser.name,
                phone: currentUser.phone,
                email: currentUser.email,
                password: currentUser.password,
                cargo: currentUser.cargo,
                roleDepartments: currentUser.profileDepartments.map((a) => ({
                    department: a.department ? { id: a.department.id } : null,
                    role: { id: a.role.id },
                })),
            };

            switch (submitType) {
                case "add":
                    res = await axiosInstance.post(`${API_BASE_URL}/users/register`, userToSend);
                    message = "Usuário criado com sucesso!";
                    break;
                case "update":
                    res = await axiosInstance.put(
                        `${API_BASE_URL}/users/${currentUser.id}`,
                        userToSend
                    );
                    message = "Usuário atualizado com sucesso!";
                    break;
                case "delete":
                    res = await axiosInstance.delete(`${API_BASE_URL}/users/${currentUser.id}`);
                    message = "Usuário excluído com sucesso!";
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
                    cargo: new Cargo(),
                    profileDepartments: [],
                    password: "",
                });

                toast.success(message);
                fetchUsersData();
            }
        } catch (error) {
            toast.error("Erro ao processar a requisição");
            console.error(error);
        } finally {
            closeModal("modal");
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
                    canCreate={canCreate}
                    canDelete={canDelete}
                />
                <Table
                    columns={columns}
                    data={data}
                    modalID="modal"
                    mode="admin"
                    handleModalOpen={handleModalOpen}
                    filterText={filterText}
                    canEdit={canEdit}
                    canDelete={canDelete}
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
                                            <PhoneInput
                                                value={currentUser.phone ?? ""}
                                                onChange={handleInputChange}
                                                disabled={modeModal === "readonly"}
                                            />
                                        </div>{" "}
                                        <div className="mt-2">
                                            <label className="form-label">Setores</label>
                                            <br></br>
                                            {currentUser.profileDepartments.map((assoc, index) => (
                                                <div className="d-flex gap-2 mb-2" key={index}>
                                                    <select
                                                        className="form-select"
                                                        value={assoc.department?.id ?? "__GLOBAL__"}
                                                        disabled={modeModal === "readonly"}
                                                        onChange={(e) => {
                                                            const newList = [
                                                                ...currentUser.profileDepartments,
                                                            ];
                                                            const selectedValue = e.target.value;

                                                            if (!newList[index].department) {
                                                                newList[index].department =
                                                                    {} as Department;
                                                            }

                                                            newList[index].department.id =
                                                                selectedValue === "__GLOBAL__"
                                                                    ? null
                                                                    : selectedValue;

                                                            setCurrentUser({
                                                                ...currentUser,
                                                                profileDepartments: newList,
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Selecione o setor</option>
                                                        <option value="__GLOBAL__">GLOBAL</option>
                                                        {departments.map((department) => (
                                                            <option
                                                                key={department.id}
                                                                value={department.id ?? ""}
                                                            >
                                                                {department.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        disabled={modeModal === "readonly"}
                                                        className="form-select"
                                                        value={assoc.role.id}
                                                        onChange={(e) => {
                                                            const newList = [
                                                                ...currentUser.profileDepartments,
                                                            ];
                                                            newList[index].role.id = e.target.value;
                                                            setCurrentUser({
                                                                ...currentUser,
                                                                profileDepartments: newList,
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Selecione o perfil</option>
                                                        {profiles.map((profile) => (
                                                            <option
                                                                key={profile.id}
                                                                value={profile.id}
                                                            >
                                                                {profile.name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        disabled={modeModal === "readonly"}
                                                        onClick={() => {
                                                            setCurrentUser((prev) => ({
                                                                ...prev,
                                                                profileDepartments:
                                                                    prev.profileDepartments.filter(
                                                                        (_, i) => i !== index
                                                                    ),
                                                            }));
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                disabled={modeModal === "readonly"}
                                                className="btn btn-outline-primary mt-2 align-self-start"
                                                onClick={() =>
                                                    setCurrentUser({
                                                        ...currentUser,
                                                        profileDepartments: [
                                                            ...currentUser.profileDepartments,
                                                            {
                                                                department: {} as Department,
                                                                role: {} as Profile,
                                                            },
                                                        ],
                                                    })
                                                }
                                            >
                                                <FaPlus /> Adicionar mais
                                            </button>
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
