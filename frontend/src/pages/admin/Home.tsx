import { useState, useEffect, JSX } from "react";
import { FaSuitcase, FaUser, FaUsers, FaStore, FaFolderOpen, FaIdBadge } from "react-icons/fa6";

import Block from "../../components/Block";
import { usePermissions } from "../../context/PermissionsContext";

interface BlockData {
    text: string;
    icon: JSX.Element;
    link: string;
    description: string;
}

const HomeAdmin: React.FC = () => {
    const blocksForms: BlockData[] = [
        {
            text: "Categorias de Formulário",
            icon: <FaFolderOpen />,
            link: "/admin/ticket_category",
            description: "Gerenciar Categorias",
        },
    ];

    const blocksCadastro: BlockData[] = [
        {
            text: "Usuários",
            icon: <FaUser />,
            link: "/admin/users",
            description: "Gerenciar usuários",
        },
        {
            text: "Perfis",
            icon: <FaIdBadge />,
            link: "/admin/profiles",
            description: "Gerenciar perfis.",
        },
        {
            text: "Setores",
            icon: <FaUsers />,
            link: "/admin/departments",
            description: "Gerenciar Setores",
        },
        {
            text: "Unidades",
            icon: <FaStore />,
            link: "/admin/units",
            description: "Gerenciar Unidades",
        },
        {
            text: "Cargos",
            icon: <FaSuitcase />,
            link: "/admin/cargos",
            description: "Gerenciar Cargos",
        },
    ];

    const [permissions, setPermissions] = useState<Record<string, boolean>>({});
    const { hasPermission } = usePermissions();

    useEffect(() => {
        const fetchPermissions = async () => {
            const permissionResults: Record<string, boolean> = {};
            const allBlocks = [...blocksCadastro, ...blocksForms];

            const removePlural = (word: string) => (word.endsWith("S") ? word.slice(0, -1) : word);

            for (const block of allBlocks) {
                let entity = block.link.split("/").pop()?.toUpperCase() || "";
                entity = removePlural(entity);
                permissionResults[block.link] = (hasPermission("EDIT_" + entity));
            }

            setPermissions(permissionResults);
        };

        fetchPermissions();
    }, []);

    return (
        <main>
            <div className="container mt-4">
                <div className="d-block pt-4">
                    <h5 className="border-bottom fw-semibold pb-1 ps-3">Cadastros</h5>
                </div>
                <div className="d-flex align-items-start flex-wrap">
                    {blocksCadastro.map((block, index) =>
                        permissions[block.link] ? (
                            <Block
                                key={index}
                                text={block.text}
                                icon={block.icon}
                                link={block.link}
                                description={block.description}
                            />
                        ) : null
                    )}
                </div>
                <div className="d-block pt-4">
                    <h5 className="border-bottom fw-semibold pb-1 ps-3">Formulários</h5>
                </div>
                <div className="d-flex align-items-start flex-wrap">
                    {blocksForms.map((block, index) =>
                        permissions[block.link] ? (
                            <Block
                                key={index}
                                text={block.text}
                                icon={block.icon}
                                link={block.link}
                                description={block.description}
                            />
                        ) : null
                    )}
                </div>
            </div>
        </main>
    );
};

export default HomeAdmin;
