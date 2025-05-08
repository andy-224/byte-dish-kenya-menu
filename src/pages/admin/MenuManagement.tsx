
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryFilter from "@/components/admin/menu/CategoryFilter";
import MenuItemCard from "@/components/admin/menu/MenuItemCard";
import CategoryList from "@/components/admin/menu/CategoryList";
import MenuItemDialog from "@/components/admin/menu/MenuItemDialog";
import EmptyMenuState from "@/components/admin/menu/EmptyMenuState";
import { useMenuManagement } from "@/hooks/useMenuManagement";

const MenuManagement: React.FC = () => {
  const {
    menuItems,
    categories,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    activeCategory,
    setActiveCategory,
    filteredItems,
    handleInputChange,
    handleSwitchChange,
    handleImageChange,
    addNewMenuItem,
    editMenuItem,
    deleteMenuItem,
    handleSubmitMenuItem,
    handleAddCategory,
    handleDeleteCategory
  } = useMenuManagement();

  return (
    <AdminLayout title="Menu Management" subtitle="Manage your restaurant menu">
      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="neo-blur backdrop-blur-md mb-6">
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu" className="animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <CategoryFilter 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            <Button 
              onClick={addNewMenuItem}
              className="bg-bytedish-neon-green hover:bg-bytedish-neon-green/90 text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </div>
          
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <MenuItemCard 
                  key={item.id}
                  item={item}
                  onEdit={editMenuItem}
                  onDelete={deleteMenuItem}
                />
              ))}
            </div>
          ) : (
            <EmptyMenuState 
              activeCategory={activeCategory}
              onAddItem={addNewMenuItem}
            />
          )}
        </TabsContent>
        
        <TabsContent value="categories" className="animate-fade-in">
          <CategoryList 
            categories={categories}
            menuItems={menuItems}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>
      
      <MenuItemDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        formData={formData}
        categories={categories}
        onInputChange={handleInputChange}
        onSwitchChange={handleSwitchChange}
        onImageChange={handleImageChange}
        onSubmit={handleSubmitMenuItem}
      />
    </AdminLayout>
  );
};

export default MenuManagement;
