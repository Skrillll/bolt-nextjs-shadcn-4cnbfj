'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';

interface SearchAndFilterProps {
  onSearch: (filters: FilterOptions) => void;
}

interface FilterOptions {
  searchTerm: string;
  priority: string;
  category: string;
  dueDate: Date | undefined;
  completed: string;
}

export default function SearchAndFilter({ onSearch }: SearchAndFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    priority: '',
    category: '',
    dueDate: undefined,
    completed: '',
  });

  const handleChange = (field: keyof FilterOptions, value: string | Date | undefined) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={filters.searchTerm}
        onChange={(e) => handleChange('searchTerm', e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={filters.priority} onValueChange={(value) => handleChange('priority', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.category} onValueChange={(value) => handleChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {/* Add category options dynamically based on user's categories */}
          </SelectContent>
        </Select>
        <Select value={filters.completed} onValueChange={(value) => handleChange('completed', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DatePicker
        date={filters.dueDate}
        setDate={(date) => handleChange('dueDate', date)}
        label="Due Date"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}