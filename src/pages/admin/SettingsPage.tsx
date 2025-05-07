
import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X, Edit, Trash } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Operator {
  id: string;
  username: string;
  fullName: string;
  password?: string;
}

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SettingsPage = () => {
  const { userRole } = useCart();
  const [businessName, setBusinessName] = useState("ByteDish Restaurant");
  const [operatorPin, setOperatorPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [printEnabled, setPrintEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [operators, setOperators] = useState<Operator[]>(() => {
    const savedOperators = localStorage.getItem("bytedish-operators");
    return savedOperators ? JSON.parse(savedOperators) : [];
  });
  const [isAddingOperator, setIsAddingOperator] = useState(false);
  const [isEditingOperator, setIsEditingOperator] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentOperator, setCurrentOperator] = useState<Operator | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      password: "",
    },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    // Save operators to localStorage whenever they change
    localStorage.setItem("bytedish-operators", JSON.stringify(operators));
  }, [operators]);
  
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

  const handleAddOperator = (values: z.infer<typeof formSchema>) => {
    const newOperator: Operator = {
      id: Date.now().toString(),
      username: values.username,
      fullName: values.fullName,
      password: values.password,
    };

    setOperators([...operators, newOperator]);
    toast.success(`Operator ${values.username} added successfully`);
    setIsAddingOperator(false);
    form.reset();
  };

  const handleEditOperator = (values: z.infer<typeof formSchema>) => {
    if (!currentOperator) return;

    const updatedOperators = operators.map(op => 
      op.id === currentOperator.id 
        ? { ...op, username: values.username, fullName: values.fullName } 
        : op
    );

    setOperators(updatedOperators);
    toast.success(`Operator ${values.username} updated successfully`);
    setIsEditingOperator(false);
    setCurrentOperator(null);
    form.reset();
  };

  const handleResetPassword = (values: z.infer<typeof resetPasswordSchema>) => {
    if (!currentOperator) return;

    const updatedOperators = operators.map(op => 
      op.id === currentOperator.id 
        ? { ...op, password: values.password } 
        : op
    );

    setOperators(updatedOperators);
    toast.success(`Password reset for ${currentOperator.username}`);
    setIsResettingPassword(false);
    setCurrentOperator(null);
    resetPasswordForm.reset();
  };

  const handleDeleteOperator = (id: string) => {
    setOperators(operators.filter(op => op.id !== id));
    toast.success("Operator deleted successfully");
  };

  const startEdit = (operator: Operator) => {
    setCurrentOperator(operator);
    form.setValue("username", operator.username);
    form.setValue("fullName", operator.fullName);
    setIsEditingOperator(true);
  };

  const startResetPassword = (operator: Operator) => {
    setCurrentOperator(operator);
    resetPasswordForm.setValue("password", "");
    setIsResettingPassword(true);
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure application settings">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="neo-blur bg-black/20">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          {userRole === "admin" && (
            <TabsTrigger value="operators">Operators</TabsTrigger>
          )}
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
        
        {userRole === "admin" && (
          <TabsContent value="operators">
            <Card className="neo-blur bg-black/10 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Operator Management</CardTitle>
                  <CardDescription>
                    Create and manage operator accounts
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    form.reset();
                    setIsAddingOperator(true);
                  }}
                  className="bg-primary"
                >
                  Add Operator
                </Button>
              </CardHeader>
              <CardContent>
                {operators.length === 0 ? (
                  <div className="text-center py-6 text-gray-400">
                    No operators have been added yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {operators.map((operator) => (
                      <div 
                        key={operator.id} 
                        className="p-4 neo-blur bg-black/20 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{operator.fullName}</div>
                          <div className="text-sm text-gray-400">@{operator.username}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => startResetPassword(operator)}
                          >
                            Reset Password
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => startEdit(operator)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteOperator(operator.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Operator Dialog */}
      <Dialog open={isAddingOperator} onOpenChange={setIsAddingOperator}>
        <DialogContent className="neo-blur bg-black/10 border-white/10">
          <DialogHeader>
            <DialogTitle>Add New Operator</DialogTitle>
            <DialogDescription>
              Create a new operator account
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddOperator)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="johndoe" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingOperator(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">Add Operator</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Operator Dialog */}
      <Dialog open={isEditingOperator} onOpenChange={setIsEditingOperator}>
        <DialogContent className="neo-blur bg-black/10 border-white/10">
          <DialogHeader>
            <DialogTitle>Edit Operator</DialogTitle>
            <DialogDescription>
              Update operator account details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditOperator)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="johndoe" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditingOperator(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResettingPassword} onOpenChange={setIsResettingPassword}>
        <DialogContent className="neo-blur bg-black/10 border-white/10">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {currentOperator?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...resetPasswordForm}>
            <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={resetPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••" 
                        className="neo-blur bg-black/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsResettingPassword(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">Reset Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SettingsPage;
