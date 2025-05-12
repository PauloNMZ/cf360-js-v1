
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import FavorecidosTable from "@/components/favorecidos/FavorecidosTable";
import FavorecidoSearchBar, { EmptyState } from "@/components/favorecidos/FavorecidoSearchBar";
import FavorecidoFormModal from "@/components/favorecidos/FavorecidoFormModal";
import DeleteFavorecidoDialog from "@/components/favorecidos/DeleteFavorecidoDialog";
import { useFavorecidos } from "@/hooks/favorecidos/useFavorecidos";

const FavorecidosPage = () => {
  const {
    filteredFavorecidos,
    isLoading,
    searchTerm,
    modalOpen,
    currentFavorecido,
    formMode,
    deleteDialogOpen,
    handleCreateNew,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleInputChange,
    handleSelectChange,
    handleSearchChange,
    handleSave,
    setModalOpen,
    setDeleteDialogOpen,
  } = useFavorecidos();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorecidos</h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          Novo Favorecido
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <FavorecidoSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange}
          hasResults={filteredFavorecidos.length > 0}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
          </div>
        ) : filteredFavorecidos.length > 0 ? (
          <FavorecidosTable 
            favorecidos={filteredFavorecidos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>

      {/* Form Modal */}
      <FavorecidoFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentFavorecido={currentFavorecido}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleSave={handleSave}
        formMode={formMode}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteFavorecidoDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isLoading}
      />
    </div>
  );
};

export default FavorecidosPage;
