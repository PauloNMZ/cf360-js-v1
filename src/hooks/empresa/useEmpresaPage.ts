
import { useState, useEffect, useRef } from "react";
import { ConvenenteData, emptyConvenente } from "@/types/convenente";
import { useConvenentes } from "@/hooks/useConvenentes";
import { useIndexPageContext } from "@/hooks/useIndexPageContext";

export const useEmpresaPage = () => {
  const [activeTab, setActiveTab] = useState('dados');
  const alertTimeoutRef = useRef<number | null>(null);
  
  // Coletar o contexto da página principal
  const {
    modalOpen,
    setModalOpen,
    formMode,
    setFormMode,
    currentConvenenteId,
    setCurrentConvenenteId,
    formData,
    setFormData,
    showDeleteDialog,
    setShowDeleteDialog,
    handleEdit: contextHandleEdit,
    handleSelectConvenente,
    handleFormDataChange,
    isLoading: isContextLoading
  } = useIndexPageContext();
  
  // Hook local para operações com convenentes
  const {
    convenentes,
    isLoading: isCrudLoading,
    handleSearch,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleGetById,
    alert,
    setAlert
  } = useConvenentes();
  
  const isLoading = isContextLoading || isCrudLoading;
  
  console.log('EmpresaPage - modalOpen:', modalOpen);
  console.log('EmpresaPage - currentConvenenteId:', currentConvenenteId);
  console.log('EmpresaPage - formData:', formData);
  console.log('EmpresaPage - formMode:', formMode);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };
  
  // Função para criar novo convenente
  const handleNewConvenente = () => {
    // Resetar o estado do formulário
    setFormData(emptyConvenente);
    setCurrentConvenenteId(null);
    setFormMode('create');
    setModalOpen(true);
    setActiveTab('dados');
  };
  
  // Função para editar o convenente selecionado
  const handleEditConvenente = () => {
    if (currentConvenenteId) {
      console.log('EmpresaPage - handleEditConvenente - Abrindo modal para edição');
      setFormMode('edit');
      setModalOpen(true);
      setActiveTab('dadosCadastrais');
    }
  };
  
  // Função para requisitar exclusão
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };
  
  // Função para confirmar exclusão
  const handleDeleteConfirm = async () => {
    if (currentConvenenteId) {
      try {
        await handleDelete(currentConvenenteId);
        setModalOpen(false);
        setCurrentConvenenteId(null);
      } catch (error) {
        console.error('Erro ao excluir convenente:', error);
      }
    }
    setShowDeleteDialog(false);
  };
  
  // Função para salvar convenente
  const handleSaveConvenente = async () => {
    try {
      if (formMode === 'create') {
        const newConvenente = await handleCreate(formData);
        if (newConvenente) {
          setModalOpen(false);
          setCurrentConvenenteId(null);
          setFormData(emptyConvenente);
          setAlert({
            type: 'success',
            message: 'Convenente criado com sucesso'
          });
        }
      } else if (formMode === 'edit' && currentConvenenteId) {
        await handleUpdate(currentConvenenteId, formData);
        setModalOpen(false);
        setCurrentConvenenteId(null);
        setFormData(emptyConvenente);
        setAlert({
          type: 'success',
          message: 'Convenente atualizado com sucesso'
        });
      }
    } catch (error) {
      // O alerta de erro já é tratado no hook useConvenentes
    }
  };
  
  // Lógica para lidar com "Ver detalhes completos"
  const handleViewDetails = () => {
    setModalOpen(true);
    // Garante que estamos no modo de visualização
    setFormMode('view');
  };

  useEffect(() => {
    if (alert && alert.type === 'success') {
      if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
      console.log('Alerta de sucesso exibido, será limpo em 5s');
      alertTimeoutRef.current = window.setTimeout(() => {
        setAlert(null);
        console.log('Alerta de sucesso limpo automaticamente após 5s');
      }, 5000);
    }
    return () => {
      if (alertTimeoutRef.current) window.clearTimeout(alertTimeoutRef.current);
    };
  }, [alert, setAlert]);

  return {
    // State
    activeTab,
    setActiveTab,
    modalOpen,
    setModalOpen,
    formMode,
    setFormMode,
    currentConvenenteId,
    setCurrentConvenenteId,
    formData,
    setFormData,
    showDeleteDialog,
    setShowDeleteDialog,
    convenentes,
    isLoading,
    isCrudLoading,
    alert,
    setAlert,
    alertTimeoutRef,
    
    // Handlers
    handleSearchChange,
    handleNewConvenente,
    handleEditConvenente,
    handleDeleteClick,
    handleDeleteConfirm,
    handleSaveConvenente,
    handleViewDetails,
    handleSelectConvenente,
    handleFormDataChange,
    handleGetById
  };
};
