
import React, { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { 
  FrownOpen,
  Frown, 
  Meh, 
  Smile, 
  SmilePlus,
  Search, 
  CalendarRange, 
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const FeedbackViewer = () => {
  const { feedback } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Calculate date ranges for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = subDays(today, 1);
  const lastWeek = subDays(today, 7);
  
  // Apply filters to feedback data
  const filteredFeedback = useMemo(() => {
    return feedback.filter(fb => {
      const fbDate = new Date(fb.timestamp);
      
      // Apply search filter (table ID)
      if (searchTerm && !fb.tableId.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply rating filter
      if (ratingFilter !== "all" && fb.rating !== parseInt(ratingFilter)) {
        return false;
      }
      
      // Apply time filter
      if (timeFilter === "today" && !isToday(fbDate)) {
        return false;
      } else if (timeFilter === "yesterday" && !isYesterday(fbDate)) {
        return false;
      } else if (timeFilter === "thisWeek" && fbDate < lastWeek) {
        return false;
      } else if (timeFilter === "specific" && selectedDate) {
        const selectedDateStart = new Date(selectedDate);
        selectedDateStart.setHours(0, 0, 0, 0);
        
        const selectedDateEnd = new Date(selectedDate);
        selectedDateEnd.setHours(23, 59, 59, 999);
        
        if (fbDate < selectedDateStart || fbDate > selectedDateEnd) {
          return false;
        }
      }
      
      return true;
    });
  }, [feedback, searchTerm, ratingFilter, timeFilter, selectedDate]);
  
  // Get emoji icon based on rating
  const getRatingEmoji = (rating: number) => {
    switch (rating) {
      case 1: return <FrownOpen className="h-5 w-5 text-red-500" />;
      case 2: return <Frown className="h-5 w-5 text-orange-500" />;
      case 3: return <Meh className="h-5 w-5 text-yellow-500" />;
      case 4: return <Smile className="h-5 w-5 text-green-500" />;
      case 5: return <SmilePlus className="h-5 w-5 text-teal-500" />;
      default: return null;
    }
  };
  
  // Format the feedback date
  const formatFeedbackDate = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };
  
  // Calculate average rating
  const averageRating = useMemo(() => {
    if (filteredFeedback.length === 0) return 0;
    
    const sum = filteredFeedback.reduce((total, fb) => total + fb.rating, 0);
    return sum / filteredFeedback.length;
  }, [filteredFeedback]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by table ID..."
            className="pl-9 neo-blur"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={ratingFilter} 
            onValueChange={setRatingFilter}
          >
            <SelectTrigger className="w-32 neo-blur">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select 
            value={timeFilter} 
            onValueChange={setTimeFilter}
          >
            <SelectTrigger className="w-32 neo-blur">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">Last 7 Days</SelectItem>
                <SelectItem value="specific">Specific Date</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {timeFilter === "specific" && (
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="neo-blur">
                  <CalendarRange className="h-4 w-4 mr-2" />
                  {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDatePickerOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      
      {filteredFeedback.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Showing {filteredFeedback.length} feedback entries
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Average rating:</span>
              <div className="flex items-center bg-white/5 rounded-full px-3 py-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`text-lg ${star <= Math.round(averageRating) ? 'text-primary' : 'text-gray-500'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredFeedback.map((fb) => (
              <div 
                key={fb.id}
                className="neo-blur rounded-lg p-4 border border-white/10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className="bg-white/10 rounded-full px-3 py-1 text-sm">
                        {fb.tableId}
                      </div>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-sm text-gray-400">
                        {formatFeedbackDate(fb.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-1.5">
                      <div className="flex items-center">
                        {getRatingEmoji(fb.rating)}
                        <span className="ml-1.5 font-medium">{fb.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 px-3 py-1 rounded text-xs">
                    Order #{fb.orderId.replace('order-', '')}
                  </div>
                </div>
                
                {fb.comment && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-gray-300 italic">"{fb.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="neo-blur rounded-xl p-8 text-center">
          <Filter className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No feedback found</p>
          {(ratingFilter !== "all" || timeFilter !== "all" || searchTerm) && (
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackViewer;
