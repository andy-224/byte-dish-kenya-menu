
import React from "react";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`category-pill shrink-0 ${
          activeCategory === "all" ? "active" : "inactive"
        }`}
        onClick={() => onCategoryChange("all")}
      >
        All Items
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-pill shrink-0 ${
            activeCategory === category.id ? "active" : "inactive"
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
