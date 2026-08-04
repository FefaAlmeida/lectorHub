"use client";

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";

export default function ChamadosPage() {

  return (
    <>
      <div className={styles.page}>
        <div className={`container ${styles.container}`}>
          
          {/* TOPBAR / HEADER */}
          <div className={`d-flex justify-content-between align-items-center ${styles.topbar}`}>
            <div>
              <span className={styles.welcomeText}>Central de Atendimento</span>
              <h1 className={styles.userName}>
                Meus <span className={styles.highlight}>Chamados Técnicos</span>
              </h1>
            </div>
            <button 
              className={`btn d-flex align-items-center justify-content-center ${styles.dashboardButton}`}
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
            >
              <i className="bi bi-plus-lg me-2 fs-6"></i> Abrir Chamado
            </button>
          </div>

          {/* CARDS INDICADORES DE PERFORMANCE */}
          <div className="row g-4 mb-5">
            <div className="col-12 col-md-4">
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ background: 'rgba(29, 78, 216, 0.08)', color: '#1d4ed8' }}>
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div>
                  <span className={styles.metricLabel}>Aguardando Análise</span>
                  <h3 className={styles.metricValue}>{totalAbertos}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ background: 'rgba(180, 83, 9, 0.08)', color: '#b45309' }}>
                  <i className="bi bi-gear-wide-connected"></i>
                </div>
                <div>
                  <span className={styles.metricLabel}>Em Atendimento</span>
                  <h3 className={styles.metricValue}>{totalAndamento}</h3>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className={styles.metricCard}>
                <div className={styles.metricIcon} style={{ background: 'rgba(21, 128, 61, 0.08)', color: '#15803d' }}>
                  <i className="bi bi-headset"></i>
                </div>
                <div>
                  <span className={styles.metricLabel}>Retornos do Suporte</span>
                  <h3 className={styles.metricValue}>{totalRespondidos}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* FILTROS E MESA DE TRABALHO */}
          <div className={`bg-white ${styles.shell}`}>
            <div className={`d-flex flex-wrap justify-content-between align-items-center p-4 border-bottom gap-3 ${styles.filterBar}`}>
              <div className="d-flex gap-2">
                {["TODOS", "ABERTO", "EM_ANDAMENTO", "FINALIZADO"].map((status) => (
                  <button
                    key={status}
                    className={`${styles.filterBtn} ${filtroStatus === status ? styles.filterBtnActive : ""}`}
                    onClick={() => setFiltroStatus(status)}
                  >
                    {MAPA_STATUS[status] || (status === "TODOS" ? "Todos" : status)}
                  </button>
                ))}
              </div>
              <span className="text-muted small fw-medium">Mostrando {chamadosFiltrados.length} solicitações</span>
            </div>

            {/* TABELA */}
            {loading && chamados.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <div className="spinner-border text-warning mb-3" role="status"></div>
                <p className="m-0 small">Buscando histórico na base de dados...</p>
              </div>
            ) : chamadosFiltrados.length === 0 ? (
              <div className="text-center py-5 text-secondary">
                <i className="bi bi-folder2-open fs-2 text-muted mb-2 d-block"></i>
                <p className="m-0 small">Nenhum chamado encontrado para este filtro.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className={`table align-middle m-0 text-dark ${styles.customTable}`}>
                  <thead>
                    <tr className="text-secondary small fw-bold">
                      <th className="px-4 py-3">ID</th>
                      <th className="py-3">Tipo</th>
                      <th className="py-3">Problema</th>
                      <th className="py-3">Descrição</th>
                      <th className="py-3">Prioridade</th>
                      <th className="py-3">Status</th>
                      <th className="px-4 py-3 text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamadosFiltrados.map((chamado) => {
                      const statusTratado = obterStatusTratado(chamado.status_chamado);
                      const prioridadeTratada = chamado.prioridade?.toUpperCase();
                      return (
                        <tr key={chamado.id_chamado} className={styles.tableRow}>
                          <td className="px-4 py-3 fw-bold text-secondary">#{chamado.id_chamado}</td>
                          <td className="py-3 small fw-semibold text-uppercase text-muted">
                            {MAPA_CATEGORIAS[chamado.tipo_chamado] || chamado.tipo_chamado}
                          </td>
                          <td className="py-3 fw-semibold text-dark">{chamado.titulo}</td>
                          <td className={`py-3 text-muted ${styles.tableDesc}`}>{chamado.descricao}</td>
                          <td className="py-3">
                            {chamado.prioridade ? (
                              <span className={`${styles.badge} ${styles[prioridadeTratada] || ""}`}>
                                {MAPA_PRIORIDADES[prioridadeTratada] || chamado.prioridade}
                              </span>
                            ) : (
                              <span className="text-muted small italic">A definir</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`${styles.badge} ${styles[statusTratado] || styles.ABERTO}`}>
                              {MAPA_STATUS[statusTratado] || statusTratado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                data-bs-toggle="modal"
                                data-bs-target="#modalDetalhesChamado"
                                onClick={() => handleVisualizarChamado(chamado.id_chamado)}
                                className={`btn btn-sm ${styles.btnDetails}`}
                              >
                                Ver Detalhes
                              </button>

                              {statusTratado === "ABERTO" ? (
                                <button
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalConfirmarCancelarChamado"
                                  onClick={() => setChamadoParaCancelar(chamado.id_chamado)}
                                  className={`btn btn-sm ${styles.btnActionDelete}`}
                                  disabled={loading}
                                >
                                  Cancelar
                                </button>
                              ) : (
                                <span className="text-muted small px-3 align-self-center">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {paginacao.totalPaginas > 1 && (
              <nav className="d-flex justify-content-center py-4 border-top">
                <ul className="pagination gap-2 m-0 border-0">
                  {Array.from({ length: paginacao.totalPaginas }, (_, i) => i + 1).map((n) => (
                    <li key={n} className="page-item">
                      <button
                        onClick={() => setPaginaAtual(n)}
                        className={`page-link border-0 shadow-sm fw-bold rounded-3 ${paginaAtual === n ? "bg-warning text-dark" : "text-dark"}`}
                      >{n}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

        </div>
      </div>

      {/* MODAL: ABRIR CHAMADO */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`modal-content ${styles.modalContent}`}>
            <div className={`p-4 d-flex justify-content-between align-items-center ${styles.modalHeader}`}>
              <h3 className="m-0 fw-bold text-white h5">
                Nova Solicitação de <span className={styles.highlight}>Suporte</span>
              </h3>
              <button className={styles.closeModalButton} onClick={() => setIsModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="p-4 bg-white">
              <form onSubmit={handleCriarChamado}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Tipo do Chamado *</label>
                  <select
                    className={`form-select ${styles.modalField}`}
                    value={formData.tipo_chamado}
                    onChange={(e) => setFormData({ ...formData, tipo_chamado: e.target.value })}
                    required
                  >
                    <option value="">Selecione o tipo de atendimento...</option>
                    <option value="MANUTENCAO">Manutenção</option>
                    <option value="LIMPEZA">Limpeza</option>
                    <option value="EMERGENCIA">Emergência</option>
                    <option value="OUTROS">Outros Assuntos</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-secondary">Título do Problema *</label>
                  <input
                    type="text"
                    className={`form-control ${styles.modalField}`}
                    placeholder="Ex: Inversor piscando luz vermelha"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-secondary">Descrição Completa *</label>
                  <textarea
                    className={`form-control ${styles.modalField}`}
                    rows="5"
                    style={{ resize: "none" }}
                    placeholder="Descreva detalhadamente o ocorrido..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2 justify-content-end border-top pt-3">
                  <button type="button" className={styles.btnSecondaryStyle} onClick={() => setIsModalOpen(false)}>
                    Voltar
                  </button>
                  <button type="submit" className={`btn fw-bold px-4 ${styles.submitButton}`} disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Chamado"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      <div className="modal fade" id="modalConfirmarCancelarChamado" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "380px" }}>
          <div className="modal-content text-center p-4" style={{ borderRadius: "24px", border: "none" }}>
            <div className="modal-body">
              <div className="text-danger mb-3">
                <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Cancelar Solicitação?</h5>
              <p className="text-muted small mb-4">Esta ação não poderá ser desfeita após a confirmação.</p>
              <div className="d-flex gap-2 justify-content-center">
                <button type="button" className={styles.btnSecondaryStyle} data-bs-dismiss="modal">Voltar</button>
                <button type="button" className="btn btn-danger px-4 fw-bold" style={{ borderRadius: "12px" }} onClick={handleCancelarConfirmado} disabled={loading}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DETALHES DO CHAMADO E RESPOSTA */}
      <div className="modal fade" id="modalDetalhesChamado" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ borderRadius: "24px", overflow: "hidden", border: "none" }}>
            
            <div className={`p-4 d-flex justify-content-between align-items-center ${styles.modalHeader}`}>
              <h5 className="modal-title fw-bold text-white m-0">
                Histórico do Chamado <span className={styles.highlight}>#{chamadoDetalhado?.id_chamado}</span>
              </h5>
              <button type="button" className={styles.closeModalButton} data-bs-dismiss="modal" aria-label="Close">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body p-4 text-dark bg-light">
              <div className="row g-3 mb-4 bg-white p-3 rounded-4 shadow-sm mx-0">
                <div className="col-6 col-md-3">
                  <span className="text-secondary small d-block mb-1">Categoria</span>
                  <strong className="text-uppercase small text-dark">{MAPA_CATEGORIAS[chamadoDetalhado?.tipo_chamado] || chamadoDetalhado?.tipo_chamado}</strong>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-secondary small d-block mb-1">Status</span>
                  <span className={`${styles.badge} ${styles[obterStatusTratado(chamadoDetalhado?.status_chamado)] || styles.ABERTO}`}>
                    {MAPA_STATUS[obterStatusTratado(chamadoDetalhado?.status_chamado)] || chamadoDetalhado?.status_chamado}
                  </span>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-secondary small d-block mb-1">Prioridade</span>
                  <strong className="small text-dark">
                    {MAPA_PRIORIDADES[chamadoDetalhado?.prioridade?.toUpperCase()] || chamadoDetalhado?.prioridade || "Em análise"}
                  </strong>
                </div>
                <div className="col-6 col-md-3">
                  <span className="text-secondary small d-block mb-1">Técnico</span>
                  <strong className="small text-dark">
                    {chamadoDetalhado?.id_tecnico 
                      ? (chamadoDetalhado?.nome_tecnico || `ID #${chamadoDetalhado.id_tecnico}`) 
                      : "Não designado"}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
                <h6 className="fw-bold text-secondary mb-2 small text-uppercase tracking-wider">Descrição Enviada</h6>
                <p className="fw-semibold text-dark mb-2">{chamadoDetalhado?.titulo}</p>
                <p className="text-muted small mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {chamadoDetalhado?.descricao}
                </p>
              </div>

              {/* RETORNO DO ADMIN */}
              <div className={styles.responseContainer}>
                <h6 className={`${styles.responseTitle} mb-3 small text-uppercase`}>
                  <i className="bi bi-shield-check me-2 fs-5"></i> Retorno do Suporte Técnico
                </h6>
                {chamadoDetalhado?.resposta_admin ? (
                  <p className="text-dark small mb-0 fw-medium" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {chamadoDetalhado.resposta_admin}
                  </p>
                ) : (
                  <p className="text-secondary small italic mb-0">
                    Sua solicitação está na fila de atendimento. A resposta do administrador aparecerá aqui.
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer bg-white border-0 p-3 justify-content-end">
              <button type="button" className={styles.btnSecondaryStyle} data-bs-dismiss="modal">
                Fechar Janela
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}