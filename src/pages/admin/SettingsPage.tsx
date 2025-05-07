
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

const SettingsPage = () => {
  const [businessName, setBusinessName] = useState("ByteDish Restaurant");
  const [operatorPin, setOperatorPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [printEnabled, setPrintEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleSaveGeneral = () => {
    // In a real app, this would save to a database
    localStorage.setItem("bytedish-business-name", businessName);
    toast.success("General settings saved successfully");
  };
  
  const handleSaveSecurity = () => {
    // In a real app, this would update the PINs securely
    toast.success("Security settings saved successfully");
  };
  
  const handleSavePreferences = () => {
    // In a real app, this would save to a database
    localStorage.setItem("bytedish-print-enabled", printEnabled.toString());
    localStorage.setItem("bytedish-notifications", notificationsEnabled.toString());
    toast.success("Preferences saved successfully");
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure application settings">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="neo-blur bg-black/20">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="neo-blur bg-black/10 border-white/10">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic information about your restaurant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="businessName">
                  Business Name
                </label>
                <Input
                  id="businessName"
                  className="neo-blur bg-black/20"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral} className="bg-primary">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="neo-blur bg-black/10 border-white/10">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage access control and PIN settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="operatorPin">
                  Operator PIN
                </label>
                <Input
                  id="operatorPin"
                  type="password"
                  className="neo-blur bg-black/20"
                  value={operatorPin}
                  onChange={(e) => setOperatorPin(e.target.value)}
                  placeholder="Enter new operator PIN"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="adminPin">
                  Admin PIN
                </label>
                <Input
                  id="adminPin"
                  type="password"
                  className="neo-blur bg-black/20"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter new admin PIN"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity} className="bg-primary">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card className="neo-blur bg-black/10 border-white/10">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Configure application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="printEnabled"
                  checked={printEnabled}
                  onChange={(e) => setPrintEnabled(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm font-medium" htmlFor="printEnabled">
                  Enable auto-printing of orders
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm font-medium" htmlFor="notificationsEnabled">
                  Enable sound notifications for new orders
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences} className="bg-primary">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
