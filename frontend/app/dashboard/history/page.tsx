'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Download, Eye, Clock, Activity, Database, FlaskConical, BarChart3, Upload, Users, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface HistoryItem {
  _id: string;
  userId: string;
  userName: string; // Add real user name
  actionType: string;
  context: string;
  timestamp: string;
  details: Record<string, any>;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch real-time activities data
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching activities from API...');
        const response = await fetch('/api/activities');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities data received:', data);
        
        if (Array.isArray(data)) {
          setHistory(data);
          setFilteredHistory(data);
        } else {
          console.error('Invalid data format received:', data);
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, dateFilter]);

  // Filter history based on search and filters
  useEffect(() => {
    let filtered = history;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.actionType === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.details?.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.timestamp) >= filterDate);
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, typeFilter, statusFilter, dateFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = filteredHistory.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data_upload':
        return <Upload className="w-4 h-4" />;
      case 'model_training':
        return <FlaskConical className="w-4 h-4" />;
      case 'eda_analysis':
        return <BarChart3 className="w-4 h-4" />;
      case 'model_deployment':
        return <Activity className="w-4 h-4" />;
      case 'model_testing':
        return <Eye className="w-4 h-4" />;
      case 'data_export':
        return <Download className="w-4 h-4" />;
      case 'settings_change':
        return <Settings className="w-4 h-4" />;
      case 'user_activity':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'data_upload':
        return 'Data Upload';
      case 'model_training':
        return 'Model Training';
      case 'eda_analysis':
        return 'EDA Analysis';
      case 'model_deployment':
        return 'Model Deployment';
      case 'model_testing':
        return 'Model Testing';
      case 'data_export':
        return 'Data Export';
      case 'settings_change':
        return 'Settings Change';
      case 'user_activity':
        return 'User Activity';
      default:
        return type;
    }
  };

  const getStatusBadge = (item: HistoryItem) => {
    const status = item.details?.status;
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const exportHistory = () => {
    const csv = [
      'Type,Title,Description,Status,User,Timestamp,Details',
      ...filteredHistory.map(item => 
        `${getTypeLabel(item.actionType)},"${item.context}","${item.context}",${item.details?.status || 'unknown'},${item.userName},"${item.timestamp}","${JSON.stringify(item.details)}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Activities</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div id="overview" className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Activity History</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your activities, model training, data uploads, and other important events.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold">{filteredHistory.length}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {history.filter(item => item.details?.status === 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {history.filter(item => item.details?.status === 'in_progress').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {history.filter(item => item.details?.status === 'failed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card id="filters" className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="data_upload">Data Upload</SelectItem>
                <SelectItem value="model_training">Model Training</SelectItem>
                <SelectItem value="eda_analysis">EDA Analysis</SelectItem>
                <SelectItem value="model_deployment">Model Deployment</SelectItem>
                <SelectItem value="model_testing">Model Testing</SelectItem>
                <SelectItem value="data_export">Data Export</SelectItem>
                <SelectItem value="settings_change">Settings Change</SelectItem>
                <SelectItem value="user_activity">User Activity</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportHistory} variant="outline" className="w-full md:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div id="activity-list" className="space-y-4">
        {currentActivities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find activities.
              </p>
            </CardContent>
          </Card>
        ) : (
          currentActivities.map((item) => (
            <Card key={item._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      {getTypeIcon(item.actionType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{item.context}</h3>
                        {getStatusBadge(item)}
                        <Badge variant="outline">{getTypeLabel(item.actionType)}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.context}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {item.userName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimestamp(item.timestamp)}
                        </span>
                        {item.details && (
                          <>
                            {item.details.dataset_name && (
                              <span className="flex items-center gap-1">
                                <Database className="w-4 h-4" />
                                {item.details.dataset_name}
                              </span>
                            )}
                            {item.details.model_name && (
                              <span className="flex items-center gap-1">
                                <FlaskConical className="w-4 h-4" />
                                {item.details.model_name}
                              </span>
                            )}
                            {item.details.accuracy && (
                              <span className="text-green-600 font-medium">
                                {item.details.accuracy.toFixed(3)} accuracy
                              </span>
                            )}
                            {item.details.file_size && (
                              <span>{item.details.file_size}</span>
                            )}
                            {item.details.duration && (
                              <span>{item.details.duration}</span>
                            )}
                            {item.details.rows_processed && (
                              <span>{item.details.rows_processed.toLocaleString()} rows</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div id="export" className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} activities
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 