
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type IssueType = "outOfStock" | "complaint" | "equipment" | "other";

interface ServiceIssue {
  id: string;
  type: IssueType;
  description: string;
  timestamp: string;
  resolved: boolean;
}

const ServiceIssueLog = () => {
  const [issues, setIssues] = useState<ServiceIssue[]>(() => {
    const savedIssues = localStorage.getItem("bytedish-service-issues");
    return savedIssues ? JSON.parse(savedIssues) : [];
  });
  const [issueType, setIssueType] = useState<IssueType>("outOfStock");
  const [description, setDescription] = useState("");

  const handleAddIssue = () => {
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    const newIssue: ServiceIssue = {
      id: `issue-${Date.now()}`,
      type: issueType,
      description: description.trim(),
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    const updatedIssues = [...issues, newIssue];
    setIssues(updatedIssues);
    localStorage.setItem("bytedish-service-issues", JSON.stringify(updatedIssues));
    setDescription("");
    toast.success("Service issue logged successfully");
  };

  const handleToggleResolved = (id: string) => {
    const updatedIssues = issues.map(issue =>
      issue.id === id ? { ...issue, resolved: !issue.resolved } : issue
    );
    
    setIssues(updatedIssues);
    localStorage.setItem("bytedish-service-issues", JSON.stringify(updatedIssues));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getIssueTypeLabel = (type: IssueType): string => {
    switch (type) {
      case "outOfStock":
        return "Out of Stock";
      case "complaint":
        return "Customer Complaint";
      case "equipment":
        return "Equipment Issue";
      case "other":
        return "Other";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 p-4 neo-blur rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold">Log Service Issue</h3>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Select
            value={issueType}
            onValueChange={(value) => setIssueType(value as IssueType)}
          >
            <SelectTrigger className="neo-blur">
              <SelectValue placeholder="Issue Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outOfStock">Out of Stock</SelectItem>
              <SelectItem value="complaint">Customer Complaint</SelectItem>
              <SelectItem value="equipment">Equipment Problem</SelectItem>
              <SelectItem value="other">Other Issue</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex-1">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue"
              className="neo-blur"
            />
          </div>
          
          <Button onClick={handleAddIssue} className="bg-primary">
            Log Issue
          </Button>
        </div>
      </div>
      
      <div className="neo-blur rounded-lg border border-white/10 overflow-hidden">
        <h3 className="bg-black/30 px-4 py-3 font-semibold">Recent Issues</h3>
        
        <div className="divide-y divide-white/10">
          {issues.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No issues have been logged
            </div>
          ) : (
            issues.map(issue => (
              <div 
                key={issue.id} 
                className={`p-4 ${
                  issue.resolved ? 'bg-green-900/10' : 'bg-transparent'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        issue.type === 'outOfStock' ? 'bg-orange-500/20 text-orange-300' :
                        issue.type === 'complaint' ? 'bg-red-500/20 text-red-300' : 
                        issue.type === 'equipment' ? 'bg-purple-500/20 text-purple-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {getIssueTypeLabel(issue.type)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(issue.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1">{issue.description}</p>
                  </div>
                  <Button
                    variant={issue.resolved ? "outline" : "default"}
                    className={issue.resolved ? "border-green-500/30 text-green-300" : "bg-primary"}
                    size="sm"
                    onClick={() => handleToggleResolved(issue.id)}
                  >
                    {issue.resolved ? "Resolved" : "Mark Resolved"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceIssueLog;
