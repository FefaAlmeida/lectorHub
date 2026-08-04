"use client";

export default function Home() {
  return (
    <>
      {/* BARRA LATERAL */}

      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary"
        style={{ width: 280 }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <svg
            className="bi pe-none me-2"
            width={40}
            height={32}
            aria-hidden="true"
          >
            <use xlinkHref="#bootstrap" />
          </svg>

          <span className="fs-4">Barra lateral</span>
        </a>

        <hr />

        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a href="#" className="nav-link active" aria-current="page">
              <svg
                className="bi pe-none me-2"
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use xlinkHref="#home" />
              </svg>

              Lar
            </a>
          </li>

          <li>
            <a href="#" className="nav-link link-body-emphasis">
              <svg
                className="bi pe-none me-2"
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use xlinkHref="#speedometer2" />
              </svg>

              Painel
            </a>
          </li>

          <li>
            <a href="#" className="nav-link link-body-emphasis">
              <svg
                className="bi pe-none me-2"
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use xlinkHref="#table" />
              </svg>

              Pedidos
            </a>
          </li>

          <li>
            <a href="#" className="nav-link link-body-emphasis">
              <svg
                className="bi pe-none me-2"
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use xlinkHref="#grid" />
              </svg>

              Produtos
            </a>
          </li>

          <li>
            <a href="#" className="nav-link link-body-emphasis">
              <svg
                className="bi pe-none me-2"
                width={16}
                height={16}
                aria-hidden="true"
              >
                <use xlinkHref="#people-circle" />
              </svg>

              Clientes
            </a>
          </li>
        </ul>

        <hr />

        <div className="dropdown">
          <a
            href="#"
            className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt="Perfil"
              width={32}
              height={32}
              className="rounded-circle me-2"
            />

            <strong>mdo</strong>
          </a>

          <ul className="dropdown-menu text-small shadow">
            <li>
              <a className="dropdown-item" href="#">
                Novo projeto...
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="#">
                Configurações
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="#">
                Perfil
              </a>
            </li>

            <li>
              <hr className="dropdown-divider" />
            </li>

            <li>
              <a className="dropdown-item" href="#">
                Sair
              </a>
            </li>
          </ul>
        </div>
      </div>

        {/* CAIXA DE TEXTO BEM-VINDO */}
        
        <div className="p-4 p-md-5 mb-4 rounded text-body-emphasis bg-body-secondary">
    {" "}
    <div className="col-lg-6 px-0">
        {" "}
        <h1 className="display-4 fst-italic">
        <font dir="auto" style={{ verticalAlign: "inherit" }}>
            <font dir="auto" style={{ verticalAlign: "inherit" }}>
            Título de uma postagem de blog mais longa
            </font>
        </font>
        </h1>{" "}
        <p className="lead my-3">
        <font dir="auto" style={{ verticalAlign: "inherit" }}>
            <font dir="auto" style={{ verticalAlign: "inherit" }}>
            Várias linhas de texto que formam o lead, informando os novos leitores
            de forma rápida e eficiente sobre o que há de mais interessante no
            conteúdo desta postagem.
            </font>
        </font>
        </p>{" "}
        <p className="lead mb-0">
        <a href="#" className="text-body-emphasis fw-bold">
            <font dir="auto" style={{ verticalAlign: "inherit" }}>
            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                Continue lendo...
            </font>
            </font>
        </a>
        </p>{" "}
    </div>{" "}

    {/* BARRA DE PESQUISA */}
   <input
    type="search"
    className="form-control"
    placeholder="Search..."
    aria-label="Search"
    />
    </div>

    {/* CARDS RAPIDOS */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
    {" "}
    <div className="col d-flex align-items-start">
        {" "}
        <svg
        className="bi text-body-secondary flex-shrink-0 me-3"
        width="1.75em"
        height="1.75em"
        aria-hidden="true"
        >
        <use xlinkHref="#bootstrap" />
        </svg>{" "}
        <div>
        {" "}
        <h3 className="fw-bold mb-0 fs-4 text-body-emphasis">
            Featured title
        </h3>{" "}
        <p>Paragraph of text beneath the heading to explain the heading.</p>{" "}
        </div>{" "}
    </div>{" "}
    <div className="col d-flex align-items-start">
        {" "}
        <svg
        className="bi text-body-secondary flex-shrink-0 me-3"
        width="1.75em"
        height="1.75em"
        aria-hidden="true"
        >
        <use xlinkHref="#cpu-fill" />
        </svg>{" "}
        <div>
        {" "}
        <h3 className="fw-bold mb-0 fs-4 text-body-emphasis">
            Featured title
        </h3>{" "}
        <p>Paragraph of text beneath the heading to explain the heading.</p>{" "}
        </div>{" "}
    </div>{" "}
    <div className="col d-flex align-items-start">
        {" "}
        <svg
        className="bi text-body-secondary flex-shrink-0 me-3"
        width="1.75em"
        height="1.75em"
        aria-hidden="true"
        >
        <use xlinkHref="#calendar3" />
        </svg>{" "}
        <div>
        {" "}
        <h3 className="fw-bold mb-0 fs-4 text-body-emphasis">
            Featured title
        </h3>{" "}
        <p>Paragraph of text beneath the heading to explain the heading.</p>{" "}
        </div>{" "}
    </div>{" "}
    <div className="col d-flex align-items-start">
        {" "}
        <svg
        className="bi text-body-secondary flex-shrink-0 me-3"
        width="1.75em"
        height="1.75em"
        aria-hidden="true"
        >
        <use xlinkHref="#home" />
        </svg>{" "}
        <div>
        {" "}
        <h3 className="fw-bold mb-0 fs-4 text-body-emphasis">
            Featured title
        </h3>{" "}
        <p>Paragraph of text beneath the heading to explain the heading.</p>{" "}
        </div>{" "}
    </div>{" "}
    </div>



    </>
  );
}