import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "components/shared/modal/modal";
import IngredientDetails, {
  ingredientModalStyles,
} from "components/app-sections/section-constructor/burger-ingredients/burger-ingredients-details";
import { useIngredientDetails } from "hooks/use-ingredient-details";

const IngredientDetailsModal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { ingredient, loading } = useIngredientDetails(id);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!id) {
    return null;
  }

  return (
    <Modal
      title={<h2 className="text text_type_main-large">Детали ингредиента</h2>}
      onClose={handleClose}
      styles={ingredientModalStyles}
    >
      {loading && !ingredient ? (
        <p className="text text_type_main-default text_color_inactive">
          Загрузка ингредиента...
        </p>
      ) : ingredient ? (
        <IngredientDetails ingredient={ingredient} />
      ) : (
        <p className="text text_type_main-default text_color_inactive">
          Ингредиент не найден
        </p>
      )}
    </Modal>
  );
};

export default IngredientDetailsModal;
