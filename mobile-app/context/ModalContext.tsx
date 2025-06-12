import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  showDeleteModal: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const openDeleteModal = (): void => setShowDeleteModal(true);
  const closeDeleteModal = (): void => setShowDeleteModal(false);

  return (
    <ModalContext.Provider
      value={{
        showDeleteModal,
        openDeleteModal,
        closeDeleteModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
