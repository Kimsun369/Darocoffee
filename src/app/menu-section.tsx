import React from 'react';

interface MenuSectionProps {
  title: string;
  items: { name: string; description: string; price: number }[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-gray-600" style={{ fontFamily: 'Khmer OS, sans-serif' }}>{item.description}</p>
              </div>
              <span className="text-gray-700">${item.price.toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSection;

