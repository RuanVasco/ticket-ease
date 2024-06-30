"use client";

import Header from '../header';
import withAuth from '../auth/withAuth';

const HomeAdmin = () => {
    return (
        <main>
            <Header pageName="Administração" />
            <div class="accordion accordion-flush" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Cadastros
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <ul>
                                <li>
                                    Filiais
                                </li>
                                <li>
                                    Setores
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>                
            </div>
        </main>
    );
};

export default withAuth(HomeAdmin);
