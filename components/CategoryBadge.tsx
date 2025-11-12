
import React from 'react';
import { TransactionCategory } from '../types';
import { CATEGORY_DETAILS } from '../constants';

interface CategoryBadgeProps {
  category: TransactionCategory;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.Other;
  
  return (
    <span className={`text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full ${details.className}`}>
      {details.icon && <details.icon className="w-4 h-4 mr-1.5" />}
      {category}
    </span>
  );
};

export default CategoryBadge;
