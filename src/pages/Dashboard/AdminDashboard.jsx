// src/pages/Dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Key, 
  CreditCard, 
  RefreshCw, 
  Calendar, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Check, 
  X, 
  Download, 
  Search, 
  Eye, 
  LogOut,
  IndianRupee,
  Users,
  FileText,
  Activity,
  Layers,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Film,
  Loader2,
  ExternalLink,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  MapPin,
  Map,
  Globe,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Tag,
  AlertCircle,
  Menu,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  ChevronDown,
  MessageSquare,
  Mail,
  HelpCircle,
  Heart,
  UserCheck,
  UserX,
  Ban,
  Phone
} from 'lucide-react';
import dataStore from '@/services/dataStore';
import { useAuth } from '@/hooks/useAuth';
import { uploadMediaFile } from '@/services/mediaService';
import UserActivityModal from '@/components/UserActivityModal';
import AdminMorphingSubmit from '@/components/AdminMorphingSubmit';
import { getAssetUrl } from '@/utils/assets';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Primary navigation: 'dashboard' | 'users' | 'properties' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sub-navigation tabs for each primary page
  const [userSubTab, setUserSubTab] = useState('enquiries'); // 'enquiries', 'visits', 'refunds', 'payments'
  const [propertySubTab, setPropertySubTab] = useState('catalog'); // 'catalog', 'add', 'locations'
  const [settingsSubTab, setSettingsSubTab] = useState('content'); // 'content', 'backups', 'logs'
  
  // Data states
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [visits, setVisits] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({});

  // Property edit / add state
  const [editingProperty, setEditingProperty] = useState(null);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState(null);

  // Property list filters & search
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all'); // 'all', 'rent', 'buy'
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('all'); // 'all', 'available', 'reserved', 'rented', 'sold', 'draft'
  const [propertyAreaFilter, setPropertyAreaFilter] = useState('all');

  // Locations management states
  const [areaSearchQuery, setAreaSearchQuery] = useState('');
  const [areaFilterStatus, setAreaFilterStatus] = useState('all'); // 'all', 'active', 'inactive', 'popular'
  const [editingArea, setEditingArea] = useState(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [deletingArea, setDeletingArea] = useState(null);
  const [reassignTargetArea, setReassignTargetArea] = useState('');
  const [editingCity, setEditingCity] = useState(null);
  const [isAddingCity, setIsAddingCity] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  // Upload loading states
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false);
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false);
  const [showVideoUrlInput, setShowVideoUrlInput] = useState(false);

  // Sub-area tag input helper
  const [subAreaInput, setSubAreaInput] = useState('');

  // Audit log filter states
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logEntityFilter, setLogEntityFilter] = useState('all');

  // Chart & Desk Filter States
  const [chartTimeframe, setChartTimeframe] = useState('monthly'); // 'monthly' | 'weekly'
  const [chartHoverIndex, setChartHoverIndex] = useState(null);
  const [visitSearchQuery, setVisitSearchQuery] = useState('');
  const [visitStatusFilter, setVisitStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'
  const [refundSearchQuery, setRefundSearchQuery] = useState('');
  const [refundStatusFilter, setRefundStatusFilter] = useState('all'); // 'all', 'pending', 'processed', 'rejected'
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');

  // Enquiry Desk Filter States
  const [enquirySearchQuery, setEnquirySearchQuery] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all'); // 'all', 'new', 'contacted', 'in_progress', 'resolved', 'closed'
  const [enquirySourceFilter, setEnquirySourceFilter] = useState('all');
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [enquiryNoteInputs, setEnquiryNoteInputs] = useState({});

  // Registered Users & Live Audience state
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [liveAudience, setLiveAudience] = useState(() => dataStore.getLiveAudience());
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState('all'); // 'all', 'online', 'with_likes', 'with_unlocks', 'with_visits'
  const [userSortBy, setUserSortBy] = useState('likes'); // 'likes', 'recent', 'name'
  const [deletingUser, setDeletingUser] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  // Initial load & real-time sync
  useEffect(() => {
    refreshData();
    const unsub = dataStore.subscribe(refreshData);
    const liveInterval = setInterval(() => {
      const lAudience = dataStore.getLiveAudience();
      setLiveAudience(lAudience);
    }, 12000);

    return () => {
      unsub();
      clearInterval(liveInterval);
    };
  }, []);

  const refreshData = async () => {
    const props = await dataStore.getProperties();
    setProperties(props || []);
    const c = await dataStore.getCities();
    setCities(c || []);
    const a = await dataStore.getAreas({ includeInactive: true });
    setAreas(a || []);
    const p = dataStore.getAllPayments();
    setPayments(p || []);
    const r = await dataStore.getRefunds();
    setRefunds(r || []);
    const v = await dataStore.getVisits();
    setVisits(v || []);
    const enqs = await dataStore.getEnquiries();
    setEnquiries(enqs || []);
    const l = dataStore.getLogs();
    setLogs(l || []);
    const s = dataStore.getSettings();
    setSettings(s || {});

    // Load registered users with detailed likes, unlocks, visits
    try {
      const uList = await dataStore.getUsersDetailed();
      setRegisteredUsers(uList || []);
      const lAudience = dataStore.getLiveAudience();
      setLiveAudience(lAudience);
    } catch (_) {}
  };

  const handleDeleteUser = async (userToDelete) => {
    if (!userToDelete) return;
    const target = userToDelete;

    // Prevent admin from deleting their own active session
    if (user && (String(target.id) === String(user.id) || (target.email && user.email && target.email.toLowerCase() === user.email.toLowerCase()))) {
      alert('You cannot delete your own active administrator account.');
      setDeletingUser(null);
      return;
    }

    // Optimistic UI update - card disappears instantly
    setRegisteredUsers(prev => prev.filter(u => 
      String(u.id).trim() !== String(target.id).trim() && 
      (!u.email || !target.email || String(u.email).toLowerCase() !== String(target.email).toLowerCase())
    ));
    setDeletingUser(null);

    try {
      await dataStore.deleteUser(target.id);
      await refreshData();
    } catch (err) {
      console.error('Failed to remove user:', err);
      alert('Failed to remove user: ' + err.message);
      await refreshData();
    }
  };

  const handleConfirmSuspendUser = async () => {
    if (!suspendingUser) return;
    const target = suspendingUser;

    // Prevent admin from suspending their own active session
    if (user && (String(target.id) === String(user.id) || (target.email && user.email && target.email.toLowerCase() === user.email.toLowerCase()))) {
      alert('You cannot suspend your own active administrator account.');
      setSuspendingUser(null);
      return;
    }

    const willSuspend = target.status !== 'suspended' && !target.isSuspended;
    const newStatus = willSuspend ? 'suspended' : 'active';

    // Optimistic UI update
    setRegisteredUsers(prev => prev.map(u => {
      if (String(u.id).trim() === String(target.id).trim() || (u.email && target.email && String(u.email).toLowerCase() === String(target.email).toLowerCase())) {
        return {
          ...u,
          status: newStatus,
          isSuspended: willSuspend,
          suspendReason: willSuspend ? (suspendReason.trim() || 'Suspended by Administrator') : null,
        };
      }
      return u;
    }));

    setSuspendingUser(null);
    setSuspendReason('');

    try {
      await dataStore.toggleSuspendUser(target.id, suspendReason.trim() || 'Suspended by Administrator');
      await refreshData();
    } catch (err) {
      console.error('Failed to update suspension status:', err);
      alert('Failed to update suspension status: ' + err.message);
      await refreshData();
    }
  };

  // --- PROPERTY HANDLERS ---
  const validatePropertyForm = () => {
    if (!editingProperty?.title?.trim()) {
      return 'Please enter a property title.';
    }
    if (!editingProperty?.main_image_url) {
      return 'Please upload or select a main cover image.';
    }
    return null;
  };

  const executeSaveProperty = async () => {
    const images = editingProperty.images && editingProperty.images.length > 0
      ? editingProperty.images
      : [editingProperty.main_image_url];

    await dataStore.saveProperty({
      ...editingProperty,
      images,
      price: Number(editingProperty.price || 0),
      deposit: Number(editingProperty.deposit || 0),
      carpet_area: Number(editingProperty.carpet_area || 0),
      builtup_area: Number(editingProperty.builtup_area || 0),
      bathrooms: Number(editingProperty.bathrooms || 1),
      balconies: Number(editingProperty.balconies || 0),
      floor: Number(editingProperty.floor || 1),
      total_floors: Number(editingProperty.total_floors || 1),
    });
  };

  const handlePropertySaveComplete = () => {
    setEditingProperty(null);
    setIsAddingProperty(false);
    setActiveSection('properties');
    refreshData();
  };

  const handleSaveProperty = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const error = validatePropertyForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      await executeSaveProperty();
      alert(isAddingProperty ? 'New property added successfully!' : 'Property changes saved successfully!');
      handlePropertySaveComplete();
    } catch (err) {
      alert('Error saving property: ' + err.message);
    }
  };

  const handleConfirmDeleteProperty = async () => {
    if (!deletingProperty) return;
    try {
      await dataStore.deleteProperty(deletingProperty.id);
      setDeletingProperty(null);
      refreshData();
    } catch (err) {
      alert('Failed to delete property: ' + err.message);
    }
  };

  const handleDuplicateProperty = async (propId) => {
    try {
      await dataStore.duplicateProperty(propId);
      alert('Property duplicated as draft copy.');
      refreshData();
    } catch (err) {
      alert('Failed to duplicate: ' + err.message);
    }
  };

  const handleQuickStatusChange = async (property, newStatus) => {
    try {
      await dataStore.saveProperty({ ...property, status: newStatus });
      refreshData();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // --- LOCATION & AREA HANDLERS ---
  const handleSaveArea = async (e) => {
    e.preventDefault();
    if (!editingArea.name?.trim()) {
      alert('Area name is required.');
      return;
    }

    try {
      await dataStore.saveArea(editingArea);
      alert(`Area "${editingArea.name}" saved successfully! Any linked properties have been updated.`);
      setEditingArea(null);
      setIsAddingArea(false);
      refreshData();
    } catch (err) {
      alert('Failed to save area: ' + err.message);
    }
  };

  const handleConfirmDeleteArea = async () => {
    if (!deletingArea) return;
    try {
      await dataStore.deleteArea(deletingArea.id, reassignTargetArea || null);
      alert(`Area "${deletingArea.name}" safely deleted. Associated properties were protected.`);
      setDeletingArea(null);
      setReassignTargetArea('');
      refreshData();
    } catch (err) {
      alert('Failed to delete area: ' + err.message);
    }
  };

  const handleToggleAreaStatus = async (areaId) => {
    try {
      await dataStore.toggleAreaStatus(areaId);
      refreshData();
    } catch (err) {
      alert('Failed to toggle status: ' + err.message);
    }
  };

  const handleMoveAreaOrder = async (area, direction) => {
    const currentIndex = areas.findIndex(a => a.id === area.id);
    if (currentIndex < 0) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= areas.length) return;

    const newOrder = [...areas];
    const temp = newOrder[currentIndex];
    newOrder[currentIndex] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    try {
      await dataStore.reorderAreas(newOrder.map(a => a.id));
      refreshData();
    } catch (err) {
      alert('Failed to reorder: ' + err.message);
    }
  };

  const handleSaveCity = async (e) => {
    e.preventDefault();
    if (!editingCity.name?.trim()) {
      alert('City name is required.');
      return;
    }
    try {
      const isNew = isAddingCity || !editingCity.id;
      const payload = isNew ? { ...editingCity, id: undefined } : editingCity;
      await dataStore.saveCity(payload);
      alert(`City "${editingCity.name.trim()}" ${isNew ? 'added' : 'updated'} successfully! Existing cities remain intact.`);
      setEditingCity(null);
      setIsAddingCity(false);
      refreshData();
    } catch (err) {
      alert('Failed to save city: ' + err.message);
    }
  };

  const handleDeleteCity = async (city) => {
    if (!city || !city.id) return;
    if (cities.length <= 1) {
      alert('You cannot delete the only city remaining on the platform.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete "${city.name}"? Any linked localities and listings will be safely reassigned to the primary city.`
    );
    if (!confirmed) return;
    try {
      await dataStore.deleteCity(city.id);
      alert(`City "${city.name}" deleted successfully.`);
      refreshData();
    } catch (err) {
      alert('Failed to delete city: ' + err.message);
    }
  };

  // --- MEDIA UPLOAD HANDLERS ---
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingMain(true);
      const res = await uploadMediaFile(file);
      if (res?.url) {
        setEditingProperty((prev) => {
          const currentImgs = prev.images || [];
          const updatedImgs = currentImgs.includes(res.url) ? currentImgs : [res.url, ...currentImgs];
          return {
            ...prev,
            main_image_url: res.url,
            images: updatedImgs,
          };
        });
      }
    } catch (err) {
      alert('Cover photo upload failed: ' + err.message);
    } finally {
      setUploadingMain(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingGallery(true);
      const newUrls = [];
      for (const file of files) {
        const res = await uploadMediaFile(file);
        if (res?.url) newUrls.push(res.url);
      }
      setEditingProperty((prev) => {
        const currentImgs = prev.images || [];
        const combined = [...currentImgs, ...newUrls];
        return {
          ...prev,
          images: combined,
          main_image_url: prev.main_image_url || newUrls[0] || '',
        };
      });
    } catch (err) {
      alert('Gallery upload failed: ' + err.message);
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setEditingProperty((prev) => {
      const imgs = prev.images || [];
      return {
        ...prev,
        images: [...imgs, newImageUrl.trim()],
        main_image_url: prev.main_image_url || newImageUrl.trim(),
      };
    });
    setNewImageUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setEditingProperty((prev) => {
      const filtered = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      let mainImg = prev.main_image_url;
      if (prev.images?.[indexToRemove] === mainImg) {
        mainImg = filtered[0] || '';
      }
      return {
        ...prev,
        images: filtered,
        main_image_url: mainImg,
      };
    });
  };

  const handleSetCoverImage = (url) => {
    setEditingProperty((prev) => ({
      ...prev,
      main_image_url: url,
    }));
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingVideo(true);
      const res = await uploadMediaFile(file);
      if (res?.url) {
        setEditingProperty((prev) => ({
          ...prev,
          video_url: res.url,
        }));
      }
    } catch (err) {
      alert('Video upload failed: ' + err.message);
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleRemoveVideo = () => {
    setEditingProperty((prev) => ({
      ...prev,
      video_url: '',
    }));
  };

  // --- SETTINGS & CONTENT HANDLER ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await dataStore.saveSettings(settings);
      alert('Website content, pricing parameters, and contact info saved successfully!');
      refreshData();
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data || (!data.properties && !data.areas)) {
          alert('Invalid backup file. Properties or areas data not found.');
          return;
        }
        if (window.confirm('Restore this database snapshot? All current data will be updated from this backup file.')) {
          if (data.properties) localStorage.setItem('vb_properties', JSON.stringify(data.properties));
          if (data.areas) localStorage.setItem('vb_areas', JSON.stringify(data.areas));
          if (data.cities) localStorage.setItem('vb_cities', JSON.stringify(data.cities));
          if (data.settings) localStorage.setItem('vb_settings', JSON.stringify(data.settings));
          if (data.payments) localStorage.setItem('vb_payments', JSON.stringify(data.payments));
          if (data.refunds) localStorage.setItem('vb_refunds', JSON.stringify(data.refunds));
          if (data.visits) localStorage.setItem('vb_visits', JSON.stringify(data.visits));
          dataStore.logAction('Database restored from JSON backup', 'System', 'backup');
          await refreshData();
          alert('Database restored successfully from backup!');
        }
      } catch (err) {
        alert('Failed to read backup file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadBackup = () => {
    const backup = {
      exported_at: new Date().toISOString(),
      city: 'Nanded',
      properties,
      areas,
      cities,
      payments,
      refunds,
      visits,
      settings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vedika-brokers-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- STATS COMPUTATION ---
  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((acc, curr) => acc + (curr.amount || 1000), 0);
  const pendingRefundsCount = refunds.filter((r) => r.status === 'pending').length;
  const totalUnlocksCount = properties.reduce((acc, curr) => acc + (curr.unlocks_count || 0), 0);
  const activeAreasCount = areas.filter(a => a.active).length;

  // Filtered audit logs
  const filteredLogs = logs.filter((log) => {
    if (logEntityFilter !== 'all' && (log.entity || '').toLowerCase() !== logEntityFilter.toLowerCase()) {
      return false;
    }
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchAction = (log.action || '').toLowerCase().includes(q);
      const matchEntity = (log.entity || '').toLowerCase().includes(q);
      const matchId = (log.entity_id || '').toLowerCase().includes(q);
      return matchAction || matchEntity || matchId;
    }
    return true;
  });

  // Filtered properties for catalog
  const filteredCatalogProperties = properties.filter((p) => {
    if (propertyTypeFilter !== 'all' && p.listing_type !== propertyTypeFilter) return false;
    if (propertyStatusFilter !== 'all' && (p.status || 'available').toLowerCase() !== propertyStatusFilter.toLowerCase()) return false;
    if (propertyAreaFilter !== 'all' && (p.area || '').toLowerCase() !== propertyAreaFilter.toLowerCase()) return false;
    if (propertySearchQuery.trim()) {
      const q = propertySearchQuery.toLowerCase().trim();
      const match = (p.title && p.title.toLowerCase().includes(q)) ||
        (p.property_code && p.property_code.toLowerCase().includes(q)) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        (p.locality && p.locality.toLowerCase().includes(q)) ||
        (p.address && p.address.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Areas belonging to the currently selected city (or all cities)
  const currentCityAreas = areas.filter((a) => {
    if (selectedCityFilter === 'all') return true;
    const matchCityId = a.city_id === selectedCityFilter;
    const matchCityName = (a.city_name || '').toLowerCase() === selectedCityFilter.toLowerCase();
    return matchCityId || matchCityName;
  });

  // Filtered areas for location management
  const filteredAreas = currentCityAreas.filter((a) => {
    if (areaFilterStatus === 'active' && !a.active) return false;
    if (areaFilterStatus === 'inactive' && a.active) return false;
    if (areaFilterStatus === 'popular' && !a.is_popular) return false;
    if (areaSearchQuery.trim()) {
      const q = areaSearchQuery.toLowerCase().trim();
      const match = a.name.toLowerCase().includes(q) ||
        (a.sub_areas && a.sub_areas.some(s => s.toLowerCase().includes(q))) ||
        (a.description && a.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Count properties per area
  const getPropertyCountForArea = (areaName) => {
    if (!areaName) return 0;
    return properties.filter(p => (p.area || '').toLowerCase() === areaName.toLowerCase()).length;
  };

  // Helper for starting new property creation
  const handleStartAddProperty = () => {
    const defaultArea = areas.find(a => a.active)?.name || 'Zenda Chowk';
    setEditingProperty({
      title: '',
      listing_type: 'rent',
      property_type: 'Apartment',
      bhk: '2 BHK',
      price: 15000,
      deposit: 35000,
      carpet_area: 800,
      builtup_area: 1000,
      city: 'Nanded',
      area: defaultArea,
      locality: '',
      address: '',
      furnishing: 'Semi-Furnished',
      parking: 'Covered Car & Bike',
      bathrooms: 2,
      balconies: 1,
      floor: 2,
      total_floors: 5,
      description: '',
      broker_name: 'Swapnil Navghare (Vedika Brokers)',
      broker_phone: '+91 93701 48697',
      whatsapp: '919370148697',
      status: 'available',
      is_verified: true,
      main_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      video_url: '',
      amenities: ['Covered Parking', 'Lift', 'Balcony', '24x7 Security'],
    });
    setIsAddingProperty(true);
    setPropertySubTab('add');
  };

  const rentCount = properties.filter((p) => p.listing_type === 'rent').length;
  const buyCount = properties.filter((p) => p.listing_type === 'buy').length;
  const verifiedCount = properties.filter((p) => p.is_verified).length;
  const draftCount = properties.filter((p) => p.status === 'draft').length;

  // Filtered visits for visits desk
  const filteredVisits = visits.filter((v) => {
    if (visitStatusFilter !== 'all' && (v.status || 'pending').toLowerCase() !== visitStatusFilter.toLowerCase()) {
      return false;
    }
    if (visitSearchQuery.trim()) {
      const q = visitSearchQuery.toLowerCase().trim();
      const matchName = (v.name || '').toLowerCase().includes(q);
      const matchPhone = (v.phone || '').toLowerCase().includes(q);
      const matchProp = (v.property?.title || v.property_id || '').toLowerCase().includes(q);
      const matchArea = (v.property?.area || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchProp || matchArea;
    }
    return true;
  });

  // Filtered refunds for refund queue
  const filteredRefunds = refunds.filter((r) => {
    if (refundStatusFilter !== 'all' && (r.status || 'pending').toLowerCase() !== refundStatusFilter.toLowerCase()) {
      return false;
    }
    if (refundSearchQuery.trim()) {
      const q = refundSearchQuery.toLowerCase().trim();
      const matchId = (r.id || '').toLowerCase().includes(q);
      const matchUpi = (r.user_upi_id || '').toLowerCase().includes(q);
      const matchProp = (r.property?.title || r.property_id || '').toLowerCase().includes(q);
      return matchId || matchUpi || matchProp;
    }
    return true;
  });

  // Filtered payments for payments desk
  const filteredPayments = payments.filter((p) => {
    if (paymentSearchQuery.trim()) {
      const q = paymentSearchQuery.toLowerCase().trim();
      const matchId = (p.id || '').toLowerCase().includes(q);
      const matchUser = (p.user_id || '').toLowerCase().includes(q);
      const matchProp = (p.property_id || '').toLowerCase().includes(q);
      const matchGateway = (p.razorpay_payment_id || '').toLowerCase().includes(q);
      return matchId || matchUser || matchProp || matchGateway;
    }
    return true;
  });

  // Interactive Chart Computations (Revenue & Visits trends)
  const baseMonthly = [
    { label: 'May', revFactor: 0.12, visFactor: 0.15 },
    { label: 'Jun', revFactor: 0.22, visFactor: 0.28 },
    { label: 'Jul', revFactor: 0.40, visFactor: 0.45 },
    { label: 'Aug', revFactor: 0.65, visFactor: 0.70 },
    { label: 'Sep', revFactor: 0.85, visFactor: 0.88 },
    { label: 'Oct (Now)', revFactor: 1.0, visFactor: 1.0 }
  ];
  const totalRevSafe = Math.max(totalRevenue, 24000);
  const totalVisSafe = Math.max(visits.length, 22);

  const monthlyChartData = baseMonthly.map(item => ({
    label: item.label,
    revenue: Math.round(totalRevSafe * item.revFactor),
    visits: Math.round(totalVisSafe * item.visFactor)
  }));

  const weeklyChartData = [
    { label: 'Week 1', revenue: Math.round(totalRevSafe * 0.18), visits: Math.max(3, Math.round(totalVisSafe * 0.18)) },
    { label: 'Week 2', revenue: Math.round(totalRevSafe * 0.24), visits: Math.max(4, Math.round(totalVisSafe * 0.24)) },
    { label: 'Week 3', revenue: Math.round(totalRevSafe * 0.28), visits: Math.max(6, Math.round(totalVisSafe * 0.28)) },
    { label: 'Week 4 (Active)', revenue: Math.round(totalRevSafe * 0.30), visits: Math.max(8, Math.round(totalVisSafe * 0.30)) }
  ];

  const activeChartData = chartTimeframe === 'monthly' ? monthlyChartData : weeklyChartData;
  const maxRevenueInChart = Math.max(...activeChartData.map(d => d.revenue), 1000);
  const maxVisitsInChart = Math.max(...activeChartData.map(d => d.visits), 1);

  // Top localities by property count
  const sortedTopAreas = [...areas]
    .map(a => ({ ...a, propCount: getPropertyCountForArea(a.name) }))
    .sort((a, b) => b.propCount - a.propCount)
    .slice(0, 5);
  const maxAreaUnits = Math.max(...sortedTopAreas.map(a => a.propCount), 1);

  // --- ENQUIRY DESK HANDLERS ---
  const filteredEnquiries = enquiries.filter(e => {
    const q = enquirySearchQuery.trim().toLowerCase();
    const matchesSearch = !q || (
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.email && e.email.toLowerCase().includes(q)) ||
      (e.message && e.message.toLowerCase().includes(q)) ||
      (e.property_code && e.property_code.toLowerCase().includes(q)) ||
      (e.property_title && e.property_title.toLowerCase().includes(q)) ||
      (e.source && e.source.toLowerCase().includes(q))
    );
    const matchesStatus = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
    const matchesSource = enquirySourceFilter === 'all' || e.source === enquirySourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const newEnquiriesCount = enquiries.filter(e => (e.status || 'new') === 'new').length;

  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    const note = window.prompt(`Optional follow-up note for changing status to "${newStatus.toUpperCase()}":`);
    if (note === null) return;
    await dataStore.updateEnquiryStatus(enquiryId, newStatus, note, user?.name || 'Swapnil Navghare (Admin)');
    await refreshData();
  };

  const handleAddEnquiryNote = async (enquiryId) => {
    const noteText = enquiryNoteInputs[enquiryId];
    if (!noteText || !noteText.trim()) return;
    await dataStore.addEnquiryNote(enquiryId, noteText.trim(), user?.name || 'Swapnil Navghare (Admin)');
    setEnquiryNoteInputs(prev => ({ ...prev, [enquiryId]: '' }));
    await refreshData();
  };

  const handleConfirmDeleteEnquiry = async () => {
    if (!deletingEnquiry) return;
    const target = deletingEnquiry;
    try {
      // Optimistic update so UI reflects deletion instantly
      setEnquiries(prev => prev.filter(e => String(e.id).trim() !== String(target.id).trim()));
      setDeletingEnquiry(null);
      await dataStore.deleteEnquiry(target.id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
      alert('Failed to delete enquiry: ' + err.message);
      await refreshData();
    }
  };

  const handleExportEnquiriesCSV = () => {
    if (!filteredEnquiries.length) {
      alert('No enquiries matching current filter to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Source', 'Type', 'Status', 'Property Code', 'Message', 'Notes Count'];
    const rows = filteredEnquiries.map(e => [
      e.id,
      new Date(e.created_at).toLocaleString('en-IN'),
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${e.phone || ''}"`,
      `"${e.email || ''}"`,
      `"${e.source || ''}"`,
      `"${e.type || ''}"`,
      `"${e.status || ''}"`,
      `"${e.property_code || ''}"`,
      `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      (e.admin_notes || []).length
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vedika_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Backwards-compatible router helper
  const navigateToSection = (sectionName) => {
    switch (sectionName) {
      case 'overview':
      case 'dashboard':
        setActiveTab('dashboard');
        setEditingProperty(null);
        setIsAddingProperty(false);
        break;
      case 'accounts':
      case 'registered':
      case 'user-directory':
        setActiveTab('users');
        setUserSubTab('accounts');
        break;
      case 'enquiries':
      case 'inquiries':
      case 'leads':
        setActiveTab('users');
        setUserSubTab('enquiries');
        break;
      case 'visits':
        setActiveTab('users');
        setUserSubTab('visits');
        break;
      case 'refunds':
        setActiveTab('users');
        setUserSubTab('refunds');
        break;
      case 'payments':
        setActiveTab('users');
        setUserSubTab('payments');
        break;
      case 'properties':
        setActiveTab('properties');
        setPropertySubTab('catalog');
        setEditingProperty(null);
        setIsAddingProperty(false);
        break;
      case 'add-property':
        handleStartAddProperty();
        setActiveTab('properties');
        setPropertySubTab('add');
        break;
      case 'locations':
        setActiveTab('properties');
        setPropertySubTab('locations');
        break;
      case 'content':
        setActiveTab('settings');
        setSettingsSubTab('content');
        break;
      case 'settings':
      case 'backups':
        setActiveTab('settings');
        setSettingsSubTab('backups');
        break;
      case 'logs':
        setActiveTab('settings');
        setSettingsSubTab('logs');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  const setActiveSection = navigateToSection;

  const activeSection = 
    activeTab === 'dashboard' ? 'overview' :
    activeTab === 'users' ? userSubTab :
    activeTab === 'properties' ? (
      (propertySubTab === 'add' || isAddingProperty || editingProperty)
        ? 'add-property'
        : propertySubTab === 'locations'
          ? 'locations'
          : 'properties'
    ) :
    activeTab === 'settings' ? (settingsSubTab === 'backups' ? 'settings' : settingsSubTab) :
    'overview';

  // 4 Primary Navigation Items
  const NAV_ITEMS = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      icon: Activity,
      desc: 'Pulse, metrics & quick launcher',
    },
    {
      id: 'users',
      label: 'User Operations',
      icon: Users,
      desc: 'Enquiries, visits, refunds & ledger',
      badge: pendingRefundsCount > 0 
        ? `${pendingRefundsCount} Refunds` 
        : (newEnquiriesCount > 0 
          ? `${newEnquiriesCount} New` 
          : (enquiries.length > 0 ? `${enquiries.length} Leads` : (visits.length > 0 ? visits.length : null))),
      badgeAlert: pendingRefundsCount > 0 || newEnquiriesCount > 0,
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building2,
      desc: 'Inventory catalog & locations',
      badge: properties.length,
    },
    {
      id: 'settings',
      label: 'Settings & Web',
      icon: Settings,
      desc: 'Content, backups & audit logs',
    },
  ];

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    if (itemId === 'dashboard') {
      setEditingProperty(null);
      setIsAddingProperty(false);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-indigo-950/70 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Navigation (Rich 5-Color Jewel Gradient: Sapphire Blue, Royal Indigo, Deep Violet, Ocean Teal & Warm Amber) */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 flex flex-col shrink-0 transition-transform duration-300 border-r border-indigo-400/20 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0b2854] via-[#201547] via-[#380e4b] to-[#043336] text-white ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* 5-Color Ambient Glow Blobs in Background */}
        <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-blue-500/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-16 w-48 h-48 rounded-full bg-purple-500/25 blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 -left-12 w-44 h-44 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-44 h-44 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-36 h-36 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between relative z-10 backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={getAssetUrl('/logo-icon.png')}
              alt="Vedika Brokers Emblem"
              className="w-9 h-9 object-contain shrink-0 drop-shadow-md"
            />
            <div>
              <div className="text-base font-black text-white font-serif tracking-tight leading-tight">
                VEDIKA BROKERS
              </div>
              <div className="text-[10px] font-black text-amber-300 tracking-widest uppercase mt-0.5">
                ADMIN DESK
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Item Primary Navigation */}
        <nav className="p-3 space-y-2 flex-1 text-xs font-semibold overflow-y-auto scrollbar-thin relative z-10">
          <div className="px-3 pt-1 pb-1 text-[10px] font-black uppercase tracking-wider text-amber-300/80">
            Control Center
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'text-blue-950 font-black shadow-md'
                    : 'text-white/90 hover:text-white bg-white/[0.04] hover:bg-white/[0.12] border border-white/[0.08] hover:border-amber-400/40 shadow-2xs'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 rounded-2xl shadow-lg shadow-amber-400/30 z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <ItemIcon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-950' : 'text-amber-300'}`} />
                  <div>
                    <div className={`text-xs font-bold leading-tight ${isActive ? 'text-blue-950 font-black' : 'text-white'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] leading-none mt-0.5 ${isActive ? 'text-blue-950/80 font-medium' : 'text-indigo-200/70 font-medium'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    item.badgeAlert
                      ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                      : isActive
                      ? 'bg-blue-950 text-amber-300 shadow-2xs'
                      : 'bg-white/15 text-white border border-white/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-2 relative z-10">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all font-medium shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>Public Website</span>
            </span>
            <span className="text-[9px] bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 px-1.5 py-0.5 rounded font-bold">Live</span>
          </a>

          <button
            onClick={async () => {
              await signOut();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-200 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 transition-all font-bold cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-rose-300" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
        {/* Top Action & Sub-Navigation Bar (Unified Clean Layout) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          {/* Left: Mobile Menu Trigger + Sub-Tabs Capsule or Dashboard Overview Title */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-100 text-slate-700 transition shrink-0 cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dashboard Title Indicator when on main dashboard */}
            {activeTab === 'dashboard' && (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-extrabold text-slate-900 font-serif leading-tight">
                    Main Dashboard Overview
                  </h1>
                </div>
              </div>
            )}

            {/* User Desk Sub-Tabs (Translucent Blue-Yellow Capsule with Smooth Sliding Pill) */}
            {activeTab === 'users' && (
              <div className="overflow-x-auto pb-1 scrollbar-none">
                <div className="relative inline-flex items-center p-1 sm:p-1.5 bg-gradient-to-r from-blue-950/20 via-amber-400/25 to-blue-900/20 backdrop-blur-xl border border-amber-400/40 ring-1 ring-blue-500/20 rounded-full shadow-xs gap-1">
                  {/* User Directory & Live Pulse Sub-Tab */}
                  <button
                    type="button"
                    onClick={() => setUserSubTab('accounts')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      userSubTab === 'accounts'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {userSubTab === 'accounts' && (
                      <motion.div
                        layoutId="userDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>User Directory & Live Pulse</span>
                      {userSubTab === 'accounts' && (
                        <motion.span
                          layoutId="userDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    <span className="relative z-10 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-white/80 text-slate-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{registeredUsers.length}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserSubTab('enquiries')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      userSubTab === 'enquiries'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {userSubTab === 'enquiries' && (
                      <motion.div
                        layoutId="userDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Customer Enquiries</span>
                      {userSubTab === 'enquiries' && (
                        <motion.span
                          layoutId="userDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    {newEnquiriesCount > 0 ? (
                      <span className="relative z-10 bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-xs">
                        {newEnquiriesCount} New
                      </span>
                    ) : (
                      <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                        userSubTab === 'enquiries' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                      }`}>
                        {enquiries.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserSubTab('visits')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      userSubTab === 'visits'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {userSubTab === 'visits' && (
                      <motion.div
                        layoutId="userDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Site Visits</span>
                      {userSubTab === 'visits' && (
                        <motion.span
                          layoutId="userDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                      userSubTab === 'visits' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                    }`}>
                      {visits.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserSubTab('refunds')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      userSubTab === 'refunds'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {userSubTab === 'refunds' && (
                      <motion.div
                        layoutId="userDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>₹500 Refunds</span>
                      {userSubTab === 'refunds' && (
                        <motion.span
                          layoutId="userDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    {pendingRefundsCount > 0 ? (
                      <span className="relative z-10 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {pendingRefundsCount} Pending
                      </span>
                    ) : (
                      <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                        userSubTab === 'refunds' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                      }`}>
                        {refunds.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserSubTab('payments')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      userSubTab === 'payments'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {userSubTab === 'payments' && (
                      <motion.div
                        layoutId="userDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Unlock Payments Ledger</span>
                      {userSubTab === 'payments' && (
                        <motion.span
                          layoutId="userDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                      userSubTab === 'payments' ? 'bg-emerald-100 text-emerald-800 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                    }`}>
                      {payments.length}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Properties Desk Sub-Tabs (Translucent Blue-Yellow Capsule with Smooth Sliding Pill) */}
            {activeTab === 'properties' && (
              <div className="space-y-2.5">
                <div className="overflow-x-auto pb-1 scrollbar-none">
                  <div className="relative inline-flex items-center p-1 sm:p-1.5 bg-gradient-to-r from-blue-950/20 via-amber-400/25 to-blue-900/20 backdrop-blur-xl border border-amber-400/40 ring-1 ring-blue-500/20 rounded-full shadow-xs gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPropertySubTab('catalog');
                        setEditingProperty(null);
                        setIsAddingProperty(false);
                      }}
                      className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                        propertySubTab === 'catalog' && !editingProperty && !isAddingProperty
                          ? 'text-blue-950 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {propertySubTab === 'catalog' && !editingProperty && !isAddingProperty && (
                        <motion.div
                          layoutId="propertiesDeskSubTabs"
                          className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex flex-col items-center">
                        <span>Inventory Catalog</span>
                        {propertySubTab === 'catalog' && !editingProperty && !isAddingProperty && (
                          <motion.span
                            layoutId="propertiesDeskUnderline"
                            className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                      </span>
                      <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                        propertySubTab === 'catalog' && !editingProperty && !isAddingProperty ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                      }`}>
                        {properties.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleStartAddProperty();
                        setPropertySubTab('add');
                      }}
                      className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-1.5 shrink-0 text-xs font-bold cursor-pointer ${
                        propertySubTab === 'add' || editingProperty || isAddingProperty
                          ? 'text-amber-900 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {(propertySubTab === 'add' || editingProperty || isAddingProperty) && (
                        <motion.div
                          layoutId="propertiesDeskSubTabs"
                          className="absolute inset-0 bg-white rounded-full shadow-md shadow-amber-400/20 border border-amber-400 z-0"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <Plus className="relative z-10 w-3.5 h-3.5 stroke-[2.5]" />
                      <span className="relative z-10 flex flex-col items-center">
                        <span>{editingProperty?.id ? 'Edit Listing' : 'Add Property'}</span>
                        {(propertySubTab === 'add' || editingProperty || isAddingProperty) && (
                          <motion.span
                            layoutId="propertiesDeskUnderline"
                            className="w-5 h-0.5 bg-amber-500 rounded-full mt-0.5"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPropertySubTab('locations');
                        setEditingProperty(null);
                        setIsAddingProperty(false);
                      }}
                      className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                        propertySubTab === 'locations'
                          ? 'text-blue-950 font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {propertySubTab === 'locations' && (
                        <motion.div
                          layoutId="propertiesDeskSubTabs"
                          className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex flex-col items-center">
                        <span>Locations & Areas</span>
                        {propertySubTab === 'locations' && (
                          <motion.span
                            layoutId="propertiesDeskUnderline"
                            className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                      </span>
                      <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                        propertySubTab === 'locations' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                      }`}>
                        {areas.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings & Web Sub-Tabs (Translucent Blue-Yellow Capsule with Smooth Sliding Pill) */}
            {activeTab === 'settings' && (
              <div className="overflow-x-auto pb-1 scrollbar-none">
                <div className="relative inline-flex items-center p-1 sm:p-1.5 bg-gradient-to-r from-blue-950/20 via-amber-400/25 to-blue-900/20 backdrop-blur-xl border border-amber-400/40 ring-1 ring-blue-500/20 rounded-full shadow-xs gap-1">
                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('content')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      settingsSubTab === 'content'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {settingsSubTab === 'content' && (
                      <motion.div
                        layoutId="settingsDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Website Content</span>
                      {settingsSubTab === 'content' && (
                        <motion.span
                          layoutId="settingsDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('backups')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      settingsSubTab === 'backups'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {settingsSubTab === 'backups' && (
                      <motion.div
                        layoutId="settingsDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Settings & Backups</span>
                      {settingsSubTab === 'backups' && (
                        <motion.span
                          layoutId="settingsDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettingsSubTab('logs')}
                    className={`relative px-4 sm:px-5 py-2 rounded-full transition-colors duration-200 flex items-center gap-2 shrink-0 text-xs font-bold cursor-pointer ${
                      settingsSubTab === 'logs'
                        ? 'text-blue-950 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {settingsSubTab === 'logs' && (
                      <motion.div
                        layoutId="settingsDeskSubTabs"
                        className="absolute inset-0 bg-white rounded-full shadow-md shadow-blue-950/10 border border-amber-300/80 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center">
                      <span>Audit Logs</span>
                      {settingsSubTab === 'logs' && (
                        <motion.span
                          layoutId="settingsDeskUnderline"
                          className="w-5 h-0.5 bg-gradient-to-r from-blue-900 to-amber-500 rounded-full mt-0.5"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                    </span>
                    <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-bold transition-all duration-200 ${
                      settingsSubTab === 'logs' ? 'bg-amber-100 text-amber-900 shadow-2xs' : 'bg-white/80 text-slate-700 shadow-2xs'
                    }`}>
                      {logs.length}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Real-time Sync Indicator + Refresh & Logout Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="hidden lg:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>

            <button
              onClick={refreshData}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh Real-time Database"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Refresh</span>
            </button>

            <button
              onClick={async () => {
                await signOut();
                navigate('/admin/login');
              }}
              className="px-3 py-1.5 sm:py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition flex items-center gap-1.5 shadow-2xs cursor-pointer text-xs font-bold"
              title="Sign Out Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
        {/* ========================================================================= */}
        {/* 1. OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Urgent Attention Action Banners */}
            {pendingRefundsCount > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/5 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <RotateCcw className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-serif flex items-center gap-2">
                      <span>Action Required: {pendingRefundsCount} Refund Claim{pendingRefundsCount > 1 ? 's' : ''} Pending Review</span>
                      <span className="bg-red-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold animate-pulse">
                        ₹{(pendingRefundsCount * 500).toLocaleString('en-IN')} Total
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Users have submitted UPI refund requests after physical inspections. Review claims and disburse within 24–48 business hours.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setActiveTab('users'); setUserSubTab('refunds'); }}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Review & Disburse</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {newEnquiriesCount > 0 && (
              <div className="bg-gradient-to-r from-blue-900/10 via-amber-500/10 to-blue-900/5 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs font-bold">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-serif flex items-center gap-2">
                      <span>Action Required: {newEnquiriesCount} New Customer Enquir{newEnquiriesCount > 1 ? 'ies' : 'y'}</span>
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded-full font-black animate-pulse">
                        Inbound Leads
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Prospective tenants and buyers have sent property inquiries and callback requests. Review notes and follow up via WhatsApp or Phone.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => { setActiveTab('users'); setUserSubTab('enquiries'); }}
                  className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-amber-400 text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Open Enquiries Desk</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Live Audience & Member Engagement Pulse Strip (Compact & High Signal) */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 border border-amber-400/30 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Live Online Users */}
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Online Now</span>
                    <span className="text-base sm:text-lg font-black text-emerald-400 font-serif leading-none">
                      {liveAudience.totalLive} Active
                    </span>
                  </div>
                </div>

                <div className="h-7 w-px bg-white/10 hidden sm:block" />

                {/* Total Registered Users */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
                    <span className="text-base sm:text-lg font-black text-white font-serif leading-none">
                      {registeredUsers.length} Members
                    </span>
                  </div>
                </div>

                <div className="h-7 w-px bg-white/10 hidden sm:block" />

                {/* Total Property Likes */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                    <Heart className="w-4 h-4 fill-rose-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Property Likes</span>
                    <span className="text-base sm:text-lg font-black text-rose-400 font-serif leading-none">
                      {registeredUsers.reduce((sum, u) => sum + (u.likesCount || 0), 0)} Saved
                    </span>
                  </div>
                </div>

                <div className="h-7 w-px bg-white/10 hidden sm:block" />

                {/* Address Unlocks */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Unlocks</span>
                    <span className="text-base sm:text-lg font-black text-amber-300 font-serif leading-none">
                      {registeredUsers.reduce((sum, u) => sum + (u.unlocksCount || 0), 0)} Leads
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setActiveTab('users'); setUserSubTab('accounts'); }}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm shrink-0 self-stretch sm:self-auto justify-center cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Open User Directory & Activity</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Glanceable KPI Metric Summary (6 clean cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* Properties */}
              <div 
                onClick={() => { setActiveTab('properties'); setPropertySubTab('catalog'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-900" /> Properties
                  </span>
                  <span className="text-[10px] bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded font-bold font-mono">Catalog</span>
                </div>
                <div className="my-2.5">
                  <div className="text-3xl font-black text-slate-900 font-serif">{properties.length}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
                  <span>{rentCount} Rent</span>
                  <span className="text-slate-300">•</span>
                  <span>{buyCount} Sale</span>
                </div>
              </div>

              {/* Localities */}
              <div 
                onClick={() => { setActiveTab('properties'); setPropertySubTab('locations'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Localities
                  </span>
                  <span className="text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">{cities.length || 1} Cities</span>
                </div>
                <div className="my-2.5">
                  <div className="text-3xl font-black text-slate-900 font-serif">{areas.length}</div>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold border-t border-slate-100 pt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{activeAreasCount} Active Areas</span>
                </div>
              </div>

              {/* Customer Enquiries */}
              <div 
                onClick={() => { setActiveTab('users'); setUserSubTab('enquiries'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Enquiries
                  </span>
                  {newEnquiriesCount > 0 ? (
                    <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded font-black font-mono animate-pulse">
                      {newEnquiriesCount} New
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold font-mono">Desk</span>
                  )}
                </div>
                <div className="my-2.5">
                  <div className="text-3xl font-black text-slate-900 font-serif">{enquiries.length}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-amber-700 font-bold">{newEnquiriesCount} New Leads</span>
                  <span className="text-slate-300">•</span>
                  <span>{enquiries.filter(e => e.status === 'resolved' || e.status === 'closed').length} Done</span>
                </div>
              </div>

              {/* Unlock Revenue */}
              <div 
                onClick={() => { setActiveTab('users'); setUserSubTab('payments'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Revenue
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">Gross</span>
                </div>
                <div className="my-2.5">
                  <div className="text-3xl font-black text-emerald-700 font-serif">₹{totalRevenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>{payments.length} Unlocks</span>
                  <span className="text-emerald-700 font-bold">₹1,000 / unit</span>
                </div>
              </div>

              {/* Pending Refunds */}
              <div 
                onClick={() => { setActiveTab('users'); setUserSubTab('refunds'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-rose-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" /> Refunds
                  </span>
                  {pendingRefundsCount > 0 ? (
                    <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">Action</span>
                  ) : (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold font-mono">Clear</span>
                  )}
                </div>
                <div className="my-2.5">
                  <div className={`text-3xl font-black font-serif ${pendingRefundsCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                    {pendingRefundsCount}
                  </div>
                </div>
                <div className="text-[10px] font-medium border-t border-slate-100 pt-2">
                  {pendingRefundsCount > 0 ? (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <span>Settle ₹{(pendingRefundsCount * 500).toLocaleString('en-IN')}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">{refunds.length} Total Claims</span>
                  )}
                </div>
              </div>

              {/* Scheduled Visits */}
              <div 
                onClick={() => { setActiveTab('users'); setUserSubTab('visits'); }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-400 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-700" /> Site Visits
                  </span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-900 px-1.5 py-0.5 rounded font-bold font-mono">Visits</span>
                </div>
                <div className="my-2.5">
                  <div className="text-3xl font-black text-indigo-900 font-serif">{visits.length}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>{visits.filter(v => v.status === 'completed').length} Completed</span>
                  <span className="text-indigo-900 font-bold">Direct Desk</span>
                </div>
              </div>
            </div>

            {/* Row 1: Core Analytical Intelligence (Financial Trend & Locality Distribution) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {/* Chart 1: Revenue & Lead Performance */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Header & Controls */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm font-serif flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" /> Financial & Lead Demand Trend
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Address unlock fees (₹) & inspection visits
                      </p>
                    </div>

                    <div className="relative flex items-center gap-1 bg-gradient-to-r from-blue-950/20 via-amber-400/25 to-blue-900/20 backdrop-blur-md border border-amber-400/40 ring-1 ring-blue-500/20 p-0.5 rounded-lg shrink-0">
                      <button
                        type="button"
                        onClick={() => setChartTimeframe('monthly')}
                        className={`relative px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                          chartTimeframe === 'monthly' ? 'text-slate-950 font-black' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {chartTimeframe === 'monthly' && (
                          <motion.div
                            layoutId="chartTimeframeIndicator"
                            className="absolute inset-0 bg-white rounded-md shadow-2xs border border-amber-300/70 z-0"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">Monthly</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartTimeframe('weekly')}
                        className={`relative px-2.5 py-0.5 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                          chartTimeframe === 'weekly' ? 'text-slate-950 font-black' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {chartTimeframe === 'weekly' && (
                          <motion.div
                            layoutId="chartTimeframeIndicator"
                            className="absolute inset-0 bg-white rounded-md shadow-2xs border border-amber-300/70 z-0"
                            transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">Weekly</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Hover / Inspection Display */}
                  {(() => {
                    const activeItem = activeChartData[chartHoverIndex !== null ? chartHoverIndex : activeChartData.length - 1];
                    return (
                      <div className="py-1 px-2.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 rounded-lg my-2 border border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-500">Period:</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {activeItem.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            ₹{activeItem.revenue.toLocaleString('en-IN')}
                          </span>
                          <span className="text-indigo-900 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {activeItem.visits} Visits
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* SVG Visual Area + Bar Graph (Compact 460 x 135) */}
                  <div className="relative pt-1">
                    <svg viewBox="0 0 460 135" className="w-full h-auto overflow-visible select-none font-sans">
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.95" />
                        </linearGradient>
                      </defs>

                      {/* Gridlines */}
                      {[0, 1, 2].map((step) => {
                        const y = 15 + step * 40;
                        return (
                          <g key={step}>
                            <line x1="38" y1={y} x2="445" y2={y} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
                            <text x="32" y={y + 3} textAnchor="end" className="text-[8px] fill-slate-400 font-mono">
                              ₹{Math.round((maxRevenueInChart * (1 - step / 2.5)) / 1000)}k
                            </text>
                          </g>
                        );
                      })}

                      {/* Visits Bars */}
                      {activeChartData.map((d, i) => {
                        const x = 50 + i * (380 / (activeChartData.length - 1 || 1));
                        const barH = (d.visits / maxVisitsInChart) * 65;
                        const y = 100 - barH;
                        const isHovered = chartHoverIndex === i;

                        return (
                          <g key={`bar-${i}`} onMouseEnter={() => setChartHoverIndex(i)} onMouseLeave={() => setChartHoverIndex(null)} className="cursor-pointer">
                            <rect
                              x={x - 8}
                              y={y}
                              width="16"
                              height={Math.max(barH, 3)}
                              rx="3"
                              fill="url(#barGradient)"
                              opacity={isHovered ? 1 : 0.8}
                              className="transition-all duration-200"
                            />
                          </g>
                        );
                      })}

                      {/* Revenue Area & Line */}
                      {(() => {
                        const points = activeChartData.map((d, i) => {
                          const x = 50 + i * (380 / (activeChartData.length - 1 || 1));
                          const y = 15 + (1 - d.revenue / maxRevenueInChart) * 80;
                          return { x, y };
                        });

                        const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                        const areaD = `${pathD} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

                        return (
                          <>
                            <path d={areaD} fill="url(#revenueGradient)" />
                            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                            {points.map((p, i) => {
                              const isHovered = chartHoverIndex === i;
                              return (
                                <g 
                                  key={`pt-${i}`}
                                  onMouseEnter={() => setChartHoverIndex(i)} 
                                  onMouseLeave={() => setChartHoverIndex(null)} 
                                  className="cursor-pointer"
                                >
                                  <circle 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r={isHovered ? 5.5 : 3.5} 
                                    fill="#ffffff" 
                                    stroke="#10b981" 
                                    strokeWidth={isHovered ? 3 : 2} 
                                    className="transition-all duration-200"
                                  />
                                </g>
                              );
                            })}
                          </>
                        );
                      })()}

                      {/* X-Axis labels */}
                      {activeChartData.map((d, i) => {
                        const x = 50 + i * (380 / (activeChartData.length - 1 || 1));
                        const isHovered = chartHoverIndex === i;
                        return (
                          <text
                            key={`lbl-${i}`}
                            x={x}
                            y="118"
                            textAnchor="middle"
                            className={`text-[9px] font-bold ${isHovered ? 'fill-slate-900 font-extrabold' : 'fill-slate-500'}`}
                          >
                            {d.label}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-800 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Fees (₹)</span>
                    </span>
                    <span className="flex items-center gap-1 text-indigo-900 font-bold">
                      <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                      <span>Visits</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Live Metric sync</span>
                </div>
              </div>

              {/* Chart 2: Prime Locality Distribution & Activity */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm font-serif flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-900" /> Prime Locality Distribution & Activity
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Concentration across key Nanded zones • Click locality to filter
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('properties'); setPropertySubTab('locations'); }}
                      className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      <span>Manage All ({areas.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {sortedTopAreas.map((area, idx) => {
                      const ratio = Math.round((area.propCount / maxAreaUnits) * 100);
                      return (
                        <div
                          key={area.id || area.name}
                          onClick={() => {
                            setPropertyAreaFilter(area.name);
                            setActiveTab('properties');
                            setPropertySubTab('catalog');
                          }}
                          className="group cursor-pointer py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/80 border border-slate-100 hover:border-amber-200 transition flex items-center justify-between gap-2.5 text-xs"
                        >
                          {/* Rank + Name + Badge */}
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="w-4 h-4 rounded bg-slate-200 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-700 font-mono font-bold text-[9px] flex items-center justify-center shrink-0 transition">
                              0{idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 group-hover:text-amber-950 truncate text-xs">
                              {area.name}
                            </span>
                            {area.is_popular && (
                              <span className="text-[8px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold shrink-0 hidden xs:inline-block">
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Inline Progress Bar */}
                          <div className="w-16 sm:w-24 bg-slate-200/80 rounded-full h-1 overflow-hidden shrink-0 hidden sm:block">
                            <div
                              className="bg-gradient-to-r from-blue-900 via-indigo-600 to-amber-500 h-1 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(ratio, 14)}%` }}
                            />
                          </div>

                          {/* Units count + Filter link */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-bold text-slate-700 bg-white group-hover:bg-amber-100/60 border border-slate-200 group-hover:border-amber-300 px-1.5 py-0.5 rounded text-[10px] transition">
                              {area.propCount} {area.propCount === 1 ? 'unit' : 'units'}
                            </span>
                            <span className="text-[10px] font-bold text-blue-900 group-hover:text-amber-700 flex items-center gap-0.5 transition">
                              Filter <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Showing top {sortedTopAreas.length} high-density areas</span>
                  <span className="font-mono font-medium text-slate-500">{activeAreasCount} Active Total</span>
                </div>
              </div>
            </div>

            {/* Row 2: Inventory Distribution & Broker Operations Command */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {/* Chart 3: Inventory Distribution Donut Chart */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="pb-2.5 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-sm font-serif flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-900" /> Inventory Distribution
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Portfolio split by rent, sale & operational availability
                    </p>
                  </div>

                  {/* SVG Donut */}
                  <div className="relative py-3 flex items-center justify-center">
                    {(() => {
                      const total = properties.length || 1;
                      const rentRatio = rentCount / total;
                      const buyRatio = buyCount / total;
                      const circ = 402.12; // 2 * PI * 64

                      const rentDash = rentRatio * circ;
                      const buyDash = buyRatio * circ;

                      return (
                        <div className="relative w-36 h-36">
                          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                            {/* Background Track */}
                            <circle
                              cx="80"
                              cy="80"
                              r="64"
                              fill="none"
                              stroke="#f1f5f9"
                              strokeWidth="16"
                            />
                            {/* Rent Segment (Blue) */}
                            {rentCount > 0 && (
                              <circle
                                cx="80"
                                cy="80"
                                r="64"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="16"
                                strokeDasharray={`${rentDash} ${circ}`}
                                strokeDashoffset="0"
                                strokeLinecap="round"
                              />
                            )}
                            {/* Buy Segment (Amber) */}
                            {buyCount > 0 && (
                              <circle
                                cx="80"
                                cy="80"
                                r="64"
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="16"
                                strokeDasharray={`${buyDash} ${circ}`}
                                strokeDashoffset={-rentDash}
                                strokeLinecap="round"
                              />
                            )}
                          </svg>

                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                            <span className="text-2xl font-black font-serif text-slate-900 leading-none">
                              {properties.length}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              Listed Units
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Status Breakdown Legend */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                  <div 
                    onClick={() => { setPropertyTypeFilter('rent'); setActiveTab('properties'); setPropertySubTab('catalog'); }}
                    className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Rent Properties
                    </span>
                    <span className="font-mono font-black text-blue-950 text-xs">
                      {rentCount} ({properties.length ? Math.round((rentCount / properties.length) * 100) : 0}%)
                    </span>
                  </div>

                  <div 
                    onClick={() => { setPropertyTypeFilter('buy'); setActiveTab('properties'); setPropertySubTab('catalog'); }}
                    className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Buy / Sale Properties
                    </span>
                    <span className="font-mono font-black text-amber-950 text-xs">
                      {buyCount} ({properties.length ? Math.round((buyCount / properties.length) * 100) : 0}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> {properties.filter(p => !p.status || p.status === 'available').length} Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> {properties.filter(p => p.status === 'reserved' || p.status === 'sold' || p.status === 'rented').length} Reserved/Sold</span>
                  </div>
                </div>
              </div>

              {/* Quick Broker Command Center */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm font-serif flex items-center gap-1.5 pb-2.5 border-b border-slate-100">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Quick Command Shortcuts
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('properties');
                        handleStartAddProperty();
                        setPropertySubTab('add');
                      }}
                      className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs transition flex flex-col items-center justify-center text-center gap-1 font-black group"
                    >
                      <Plus className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Add Property</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('properties');
                        setPropertySubTab('locations');
                        setIsAddingArea(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 transition flex flex-col items-center justify-center text-center gap-1 group"
                    >
                      <MapPin className="w-4 h-4 text-blue-900 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Add Locality</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('users'); setUserSubTab('refunds'); }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-rose-900 border border-slate-200 transition flex flex-col items-center justify-center text-center gap-1 group"
                    >
                      <RotateCcw className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">₹500 Refunds</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveTab('users'); setUserSubTab('visits'); }}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 border border-slate-200 transition flex flex-col items-center justify-center text-center gap-1 group"
                    >
                      <Calendar className="w-4 h-4 text-indigo-700 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Visits Desk</span>
                    </button>
                  </div>
                </div>

                {/* Broker Info Card & Backup */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Authorized Broker:</span>
                      <span className="font-extrabold text-slate-900 font-serif text-xs">Swapnil Navghare</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-[11px]">Desk Mobile:</span>
                      <a href="tel:+919370148697" className="font-bold text-blue-900 hover:underline text-xs">
                        +91 93701 48697
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadBackup}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Full Backup (JSON)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Third Row: Recent Activity Stream */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-serif flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" /> Live Activity Stream
                </h3>
                <span className="text-xs text-slate-400">Recent audits & system events</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {logs.slice(0, 3).map((log, i) => (
                  <div key={log.id || i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                        {log.entity || 'Platform'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.created_at || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 truncate">
                      {log.action || 'System action recorded'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      ID: {log.entity_id || 'general'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. LOCATIONS & AREAS MANAGEMENT DESK */}
        {/* ========================================================================= */}
        {activeSection === 'locations' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-amber-500" />
                  Cities & Localities Desk
                </h1>
                <p className="text-xs text-slate-500">
                  Manage operating cities ({cities.length}), search localities ({areas.length}), sub-areas, and listing coverage.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCity({
                      name: '',
                      state: 'Maharashtra',
                      pincode: '',
                      description: '',
                      active: true,
                      is_primary: false,
                    });
                    setIsAddingCity(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Add a new city without altering existing cities"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add City</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const activeCity = cities.find(c => c.id === selectedCityFilter) || cities[0] || { id: 'city-nanded', name: 'Nanded' };
                    setEditingArea({
                      name: '',
                      city_id: activeCity.id,
                      city_name: activeCity.name,
                      sub_areas: [],
                      description: '',
                      is_popular: true,
                      display_order: areas.length + 1,
                      active: true,
                    });
                    setIsAddingArea(true);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Locality
                </button>
              </div>
            </div>

            {/* Operating Cities Deck */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Operating Cities ({cities.length})
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    • Click "All Cities" or any city below to filter localities
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCity({
                      name: '',
                      state: 'Maharashtra',
                      pincode: '',
                      description: '',
                      active: true,
                      is_primary: false,
                    });
                    setIsAddingCity(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200/80 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add City
                </button>
              </div>

              {/* Grid of Cities: First "All Cities", followed by registered cities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. All Cities Card */}
                <div
                  onClick={() => setSelectedCityFilter('all')}
                  className={`rounded-xl p-3.5 border transition cursor-pointer space-y-2.5 relative group ${
                    selectedCityFilter === 'all'
                      ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-900/30 shadow-xs'
                      : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 transition ${
                        selectedCityFilter === 'all'
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-200 text-slate-700 group-hover:bg-blue-900 group-hover:text-white'
                      }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs">All Operating Cities</h4>
                        </div>
                        <p className="text-[10px] text-slate-500">Across {cities.length} Registered Cities</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition ${
                      selectedCityFilter === 'all'
                        ? 'bg-blue-900 text-white shadow-2xs'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {selectedCityFilter === 'all' ? 'Active Filter' : 'Select'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                      <span>{areas.length} Localities</span>
                      <span>•</span>
                      <span>{properties.length} Properties</span>
                    </div>

                    <span className="text-[10px] font-bold text-blue-900">
                      {selectedCityFilter === 'all' ? 'Viewing All' : 'Show All'}
                    </span>
                  </div>
                </div>

                {/* 2. Registered Cities */}
                {cities.map((city) => {
                  const cityAreas = areas.filter(a => a.city_id === city.id || a.city_name === city.name);
                  const cityProps = properties.filter(p => (p.city || '').toLowerCase() === city.name.toLowerCase());
                  const isSelected = selectedCityFilter === city.id || (selectedCityFilter !== 'all' && (selectedCityFilter.toLowerCase() === (city.name || '').toLowerCase()));

                  return (
                    <div
                      key={city.id}
                      onClick={() => setSelectedCityFilter(city.id)}
                      className={`rounded-xl p-3.5 border transition cursor-pointer space-y-2.5 relative group ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-900/30 shadow-xs'
                          : 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 transition ${
                            isSelected ? 'bg-blue-950 text-amber-400' : 'bg-slate-800 text-white'
                          }`}>
                            {city.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-slate-900 text-xs">{city.name}</h4>
                              {city.is_primary && (
                                <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500">{city.state || 'Maharashtra'} {city.pincode ? `• PIN: ${city.pincode}` : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-blue-900 text-white shadow-2xs'
                              : city.active !== false
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isSelected ? 'Active Filter' : (city.active !== false ? 'Active' : 'Inactive')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                          <span>{cityAreas.length} Localities</span>
                          <span>•</span>
                          <span>{cityProps.length} Properties</span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCity({ ...city });
                              setIsAddingCity(false);
                            }}
                            className="p-1 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-white transition cursor-pointer"
                            title="Edit city"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {cities.length > 1 && !city.is_primary && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCity(city);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition cursor-pointer"
                              title="Delete city"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter and Search Bar for Areas */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="w-full md:w-80 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder={
                    selectedCityFilter === 'all'
                      ? 'Search localities across all cities...'
                      : `Search localities in ${cities.find(c => c.id === selectedCityFilter || (c.name || '').toLowerCase() === selectedCityFilter.toLowerCase())?.name || 'city'}...`
                  }
                  value={areaSearchQuery}
                  onChange={(e) => setAreaSearchQuery(e.target.value)}
                  className="bg-transparent w-full focus:outline-none font-medium placeholder:text-slate-400"
                />
                {areaSearchQuery && (
                  <button onClick={() => setAreaSearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: `All (${currentCityAreas.length})` },
                  { id: 'active', label: `Active (${currentCityAreas.filter(a => a.active).length})` },
                  { id: 'popular', label: `Popular (${currentCityAreas.filter(a => a.is_popular).length})` },
                  { id: 'inactive', label: `Inactive (${currentCityAreas.filter(a => !a.active).length})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAreaFilterStatus(f.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap text-xs cursor-pointer ${
                      areaFilterStatus === f.id
                        ? 'bg-blue-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}

                {(areaSearchQuery || areaFilterStatus !== 'all' || selectedCityFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setAreaSearchQuery('');
                      setAreaFilterStatus('all');
                      setSelectedCityFilter('all');
                    }}
                    className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    title="Reset all locality and city filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Areas Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 w-16">Order</th>
                      <th className="px-4 py-3">Locality</th>
                      <th className="px-4 py-3">Sub-Areas & Landmarks</th>
                      <th className="px-4 py-3 text-center">Units</th>
                      <th className="px-4 py-3 text-center">Popular</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAreas.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                          No localities found matching your selection.
                        </td>
                      </tr>
                    ) : (
                      filteredAreas.map((area, index) => {
                        const pCount = getPropertyCountForArea(area.name);
                        return (
                          <tr key={area.id} className="hover:bg-slate-50/70 transition">
                            {/* Order & Reorder arrows */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-600">
                                <span>#{area.display_order || index + 1}</span>
                                <div className="flex flex-col">
                                  <button
                                    onClick={() => handleMoveAreaOrder(area, 'up')}
                                    disabled={index === 0}
                                    className="p-0.5 text-slate-400 hover:text-blue-900 disabled:opacity-20 transition"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveAreaOrder(area, 'down')}
                                    disabled={index === filteredAreas.length - 1}
                                    className="p-0.5 text-slate-400 hover:text-blue-900 disabled:opacity-20 transition"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Area Name & Description */}
                            <td className="px-4 py-3">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 text-sm">{area.name}</span>
                                  {selectedCityFilter === 'all' && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                      {area.city_name || cities.find(c => c.id === area.city_id)?.name || 'Nanded'}
                                    </span>
                                  )}
                                </div>
                                <span className="block text-[10px] text-slate-400 font-mono">slug: {area.slug}</span>
                                {area.description && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{area.description}</p>
                                )}
                              </div>
                            </td>

                            {/* Sub-areas pills */}
                            <td className="px-4 py-3 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {area.sub_areas && area.sub_areas.length > 0 ? (
                                  area.sub_areas.map((sub, sIdx) => (
                                    <span key={sIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-200">
                                      {sub}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">No sub-areas listed</span>
                                )}
                              </div>
                            </td>

                            {/* Linked Property Count */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => {
                                  setPropertyAreaFilter(area.name);
                                  setActiveSection('properties');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-950 font-bold hover:bg-blue-100 transition border border-blue-200"
                                title="Click to view properties in this area"
                              >
                                <span>{pCount}</span>
                                <span className="text-[10px] text-slate-500">Units</span>
                              </button>
                            </td>

                            {/* Popular on Homepage badge */}
                            <td className="px-4 py-3 text-center">
                              {area.is_popular ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-300">
                                  Popular
                                </span>
                              ) : (
                                <span className="text-slate-300 text-[11px]">—</span>
                              )}
                            </td>

                            {/* Status Toggle */}
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleAreaStatus(area.id)}
                                className={`px-2.5 py-1 rounded-full font-bold text-[10px] transition border ${
                                  area.active
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                                    : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                                }`}
                              >
                                {area.active ? 'Active' : 'Inactive'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingArea({
                                      ...area,
                                      sub_areas: Array.isArray(area.sub_areas) ? [...area.sub_areas] : [],
                                    });
                                    setIsAddingArea(false);
                                  }}
                                  className="p-1.5 text-blue-700 hover:bg-blue-100 rounded-lg transition"
                                  title="Edit / Rename Area"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setDeletingArea(area);
                                    const otherArea = areas.find(a => a.id !== area.id);
                                    setReassignTargetArea(otherArea ? otherArea.name : (cities[0]?.name || 'General Area'));
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition"
                                  title="Delete Area"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. PROPERTIES CATALOG */}
        {/* ========================================================================= */}
        {(activeSection === 'properties' || activeSection === 'add-property') && (
          <div className="space-y-4 sm:space-y-5">

            {/* Inline Property Form (Create / Edit) */}
            {(isAddingProperty || editingProperty) && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
                <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      {editingProperty?.id ? <Edit className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-900" />}
                      {editingProperty?.id ? `Edit Listing (${editingProperty.property_code})` : 'Create New Property Listing'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">All updates sync immediately across live listings.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setIsAddingProperty(false);
                      setPropertySubTab('catalog');
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProperty} className="space-y-6">
                  {/* Subsection 1: Basic Info */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Tag className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        1. Basic Listing Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Property Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProperty.title}
                          onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                          placeholder="e.g. Spacious 2 BHK Near Zenda Chowk with Covered Parking"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-900 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type</label>
                        <select
                          value={editingProperty.listing_type}
                          onChange={(e) => setEditingProperty({ ...editingProperty, listing_type: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none bg-white text-blue-950"
                        >
                          <option value="rent">Rent</option>
                          <option value="buy">Sale</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                        <select
                          value={editingProperty.property_type || 'Apartment'}
                          onChange={(e) => setEditingProperty({ ...editingProperty, property_type: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                        >
                          <option value="Apartment">Apartment / Flat</option>
                          <option value="Independent House">Independent House / Row House</option>
                          <option value="Villa">Villa / Bungalow</option>
                          <option value="Commercial">Commercial Office / Shop</option>
                          <option value="Plot">Residential Plot</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Configuration (BHK)</label>
                        <select
                          value={editingProperty.bhk}
                          onChange={(e) => setEditingProperty({ ...editingProperty, bhk: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                        >
                          <option value="1 RK">1 RK</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="4 BHK+">4 BHK+ / Penthouse</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {editingProperty.listing_type === 'rent' ? 'Monthly Rent (₹)' : 'Sale Price (₹)'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProperty.price}
                          onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                          placeholder="e.g. 15000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection 2: Location & Protected Address */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-900" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          2. Location & Protected Address
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection('locations')}
                        className="text-[11px] font-bold text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Manage / Add Areas
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                        <select
                          value={editingProperty.city || cities[0]?.name || ''}
                          onChange={(e) => {
                            const newCity = e.target.value;
                            const firstAreaForCity = areas.find(a => (a.city_name || '').toLowerCase() === newCity.toLowerCase());
                            setEditingProperty({
                              ...editingProperty,
                              city: newCity,
                              ...(firstAreaForCity ? { area: firstAreaForCity.name } : {})
                            });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                        >
                          {cities.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}, {c.state}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Area */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Locality / Area <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={editingProperty.area || ''}
                          onChange={(e) => setEditingProperty({ ...editingProperty, area: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none bg-white text-blue-950"
                        >
                          {(() => {
                            const cityAreas = areas.filter(a => (a.city_name || '').toLowerCase() === (editingProperty.city || cities[0]?.name || '').toLowerCase());
                            const areaList = cityAreas.length > 0 ? cityAreas : areas;
                            return areaList.map((a) => (
                              <option key={a.id} value={a.name}>
                                {a.name} {!a.active ? '(Inactive)' : ''}
                              </option>
                            ));
                          })()}
                        </select>
                      </div>

                      {/* Locality / Landmark */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / Sector</label>
                        <input
                          type="text"
                          value={editingProperty.locality}
                          onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                          placeholder="e.g. Near Gandhi Market Road"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    {/* Sub-areas quick clickable suggestions */}
                    {(() => {
                      const matchedArea = areas.find(a => a.name.toLowerCase() === (editingProperty.area || '').toLowerCase());
                      if (matchedArea && matchedArea.sub_areas && matchedArea.sub_areas.length > 0) {
                        return (
                          <div className="flex items-center gap-1.5 flex-wrap text-xs">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Quick suggestions:</span>
                            {matchedArea.sub_areas.map((sub, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => setEditingProperty({ ...editingProperty, locality: sub })}
                                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-[10px] transition font-medium cursor-pointer"
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-blue-900 inline" /> Exact Protected Address <span className="text-[10px] text-amber-700 font-semibold">(Revealed only upon ₹1,000 unlock)</span>
                      </label>
                      <input
                        type="text"
                        value={editingProperty.address}
                        onChange={(e) => setEditingProperty({ ...editingProperty, address: e.target.value })}
                        placeholder="e.g. Flat 304, Wing B, Society Name, Near Landmark Road"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* Subsection 3: Specifications & Financials */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Layers className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        3. Property Specifications & Financials
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Deposit (₹)</label>
                        <input
                          type="number"
                          value={editingProperty.deposit}
                          onChange={(e) => setEditingProperty({ ...editingProperty, deposit: e.target.value })}
                          placeholder="e.g. 30000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Carpet Area (sqft)</label>
                        <input
                          type="number"
                          value={editingProperty.carpet_area}
                          onChange={(e) => setEditingProperty({ ...editingProperty, carpet_area: e.target.value })}
                          placeholder="e.g. 850"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Furnishing</label>
                        <select
                          value={editingProperty.furnishing}
                          onChange={(e) => setEditingProperty({ ...editingProperty, furnishing: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        >
                          <option value="Unfurnished">Unfurnished</option>
                          <option value="Semi-Furnished">Semi-Furnished</option>
                          <option value="Fully-Furnished">Fully-Furnished</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Parking</label>
                        <input
                          type="text"
                          value={editingProperty.parking}
                          onChange={(e) => setEditingProperty({ ...editingProperty, parking: e.target.value })}
                          placeholder="e.g. Covered Car & Bike"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
                        <input
                          type="number"
                          value={editingProperty.bathrooms || 1}
                          onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Balconies</label>
                        <input
                          type="number"
                          value={editingProperty.balconies || 0}
                          onChange={(e) => setEditingProperty({ ...editingProperty, balconies: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Floor No.</label>
                        <input
                          type="number"
                          value={editingProperty.floor || 1}
                          onChange={(e) => setEditingProperty({ ...editingProperty, floor: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Total Floors</label>
                        <input
                          type="number"
                          value={editingProperty.total_floors || 5}
                          onChange={(e) => setEditingProperty({ ...editingProperty, total_floors: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection 4: Media & Photos */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <ImageIcon className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        4. Photos & Media Gallery
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cover Photo */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <label className="text-xs font-bold text-slate-800">
                              Main Cover Photo <span className="text-red-500">*</span>
                            </label>
                            <p className="text-[10px] text-slate-400">Card thumbnail</p>
                          </div>

                          <label className={`cursor-pointer inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition ${uploadingMain ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploadingMain ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Upload Cover
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {editingProperty.main_image_url ? (
                          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                            <img
                              src={editingProperty.main_image_url}
                              alt="Cover Preview"
                              className="w-16 h-14 object-cover rounded-lg border border-slate-200 shadow-2xs shrink-0"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Cover Photo Set
                              </p>
                              <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                                {editingProperty.main_image_url}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setEditingProperty({ ...editingProperty, main_image_url: '' })}
                              className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 px-2 py-1 rounded-lg transition"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-white/60">
                            <p className="text-[11px] text-slate-400 font-medium">No cover photo selected</p>
                          </div>
                        )}
                      </div>

                      {/* Gallery Photos */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <label className="text-xs font-bold text-slate-800">
                              Gallery ({editingProperty.images?.length || 0} Photos)
                            </label>
                            <p className="text-[10px] text-slate-400">Additional room views</p>
                          </div>

                          <label className={`cursor-pointer inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition ${uploadingGallery ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploadingGallery ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" /> Add Photos
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Thumbnails Grid */}
                        {editingProperty.images && editingProperty.images.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {editingProperty.images.map((imgUrl, idx) => {
                              const isCover = editingProperty.main_image_url === imgUrl;
                              return (
                                <div key={idx} className="relative group bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                                  <img
                                    src={imgUrl}
                                    alt={`Gallery ${idx + 1}`}
                                    className="w-full h-16 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCoverImage(imgUrl)}
                                        className="bg-amber-400 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded shadow hover:bg-amber-300"
                                      >
                                        Cover
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryImage(idx)}
                                      className="bg-red-600 text-white p-1 rounded shadow hover:bg-red-700"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {isCover && (
                                    <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1 rounded shadow">
                                      COVER
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic py-1">No additional gallery photos added</p>
                        )}
                      </div>

                      {/* Video Tour Upload & Preview */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3 sm:col-span-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <VideoIcon className="w-3.5 h-3.5 text-blue-900" />
                              <span>Property Walkthrough Video Tour</span>
                            </label>
                            <p className="text-[10px] text-slate-400">Upload MP4, WebM or paste a direct video tour link</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className={`cursor-pointer inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
                              {uploadingVideo ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#71DFBE]" />
                                  <span className="text-[#71DFBE]">Uploading Video...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5 text-[#71DFBE]" />
                                  <span>Upload Video Tour</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setShowVideoUrlInput(!showVideoUrlInput)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                            >
                              {showVideoUrlInput ? 'Hide URL' : 'Link Video'}
                            </button>
                          </div>
                        </div>

                        {showVideoUrlInput && (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="url"
                              placeholder="https://example.com/tour.mp4"
                              value={editingProperty.video_url || ''}
                              onChange={(e) => setEditingProperty({ ...editingProperty, video_url: e.target.value })}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                            />
                          </div>
                        )}

                        {editingProperty.video_url ? (
                          <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#71DFBE] flex items-center gap-1">
                                <Film className="w-3.5 h-3.5" /> Video Tour Attached
                              </span>
                              <button
                                type="button"
                                onClick={handleRemoveVideo}
                                className="text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/60 px-2 py-0.5 rounded-lg transition"
                              >
                                Remove Video
                              </button>
                            </div>
                            <video
                              src={editingProperty.video_url}
                              controls
                              className="w-full max-h-48 rounded-lg bg-black object-cover"
                            />
                          </div>
                        ) : (
                          <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-white/60">
                            <p className="text-[11px] text-slate-400 font-medium">No tour video attached (Optional)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subsection 5: Status & Contact */}
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Settings className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        5. Listing Status & Broker Contacts
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                        <select
                          value={editingProperty.status || 'available'}
                          onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none bg-white cursor-pointer"
                        >
                          <option value="available">Available (Public)</option>
                          <option value="reserved">Reserved</option>
                          <option value="rented">Rented</option>
                          <option value="sold">Sold</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Broker Direct Phone</label>
                        <input
                          type="text"
                          value={editingProperty.broker_phone || '+91 93701 48697'}
                          onChange={(e) => setEditingProperty({ ...editingProperty, broker_phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Support</label>
                        <input
                          type="text"
                          value={editingProperty.whatsapp || '919370148697'}
                          onChange={(e) => setEditingProperty({ ...editingProperty, whatsapp: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subsection 6: Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                      <FileText className="w-4 h-4 text-blue-900" />
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        6. Public Description & Highlights
                      </label>
                    </div>
                    <textarea
                      rows={3}
                      value={editingProperty.description}
                      onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                      placeholder="Highlights regarding ventilation, society amenities, power backup, water supply, and neighborhood..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none bg-white"
                    />
                  </div>

                  {/* Form Footer Actions with Morphing Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProperty(null);
                        setIsAddingProperty(false);
                        setPropertySubTab('catalog');
                      }}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
                    >
                      Cancel
                    </button>

                    <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                      <AdminMorphingSubmit
                        text={isAddingProperty ? "Submit & Publish Property" : "Save Changes & Update Media"}
                        submittingText="Uploading Media & Saving Property..."
                        successText={isAddingProperty ? "Property & Media Added Successfully!" : "Property Changes Saved Successfully!"}
                        onValidate={validatePropertyForm}
                        onSubmit={executeSaveProperty}
                        onComplete={handlePropertySaveComplete}
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Property Catalog Filters & Search Toolbar */}
            {!isAddingProperty && !editingProperty && (
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search title, code, or locality..."
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                      className="bg-transparent w-full focus:outline-none placeholder:text-slate-400 font-medium"
                    />
                    {propertySearchQuery && (
                      <button onClick={() => setPropertySearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Type Segmented Pill */}
                  <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl gap-0.5 font-bold">
                    <button
                      type="button"
                      onClick={() => setPropertyTypeFilter('all')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                        propertyTypeFilter === 'all'
                          ? 'bg-white text-slate-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({properties.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyTypeFilter('rent')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                        propertyTypeFilter === 'rent'
                          ? 'bg-white text-blue-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Rent ({rentCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropertyTypeFilter('buy')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-xs ${
                        propertyTypeFilter === 'buy'
                          ? 'bg-white text-amber-900 shadow-2xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sale ({buyCount})
                    </button>
                  </div>

                  {/* Locality Filter */}
                  <select
                    value={propertyAreaFilter}
                    onChange={(e) => setPropertyAreaFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Localities</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={propertyStatusFilter}
                    onChange={(e) => setPropertyStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="rented">Rented</option>
                    <option value="sold">Sold</option>
                    <option value="draft">Drafts ({draftCount})</option>
                  </select>

                  {/* Reset Filters */}
                  {(propertySearchQuery || propertyTypeFilter !== 'all' || propertyStatusFilter !== 'all' || propertyAreaFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setPropertySearchQuery('');
                        setPropertyTypeFilter('all');
                        setPropertyStatusFilter('all');
                        setPropertyAreaFilter('all');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="Clear all filters"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Properties Table */}
            {!isAddingProperty && !editingProperty && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Locality</th>
                        <th className="px-4 py-3">Price / Rent</th>
                        <th className="px-4 py-3 text-center" title="Paid Address Unlocks (₹1,000 each) by prospective clients">
                          <span className="inline-flex items-center gap-1 cursor-help">
                            Unlocks
                          </span>
                        </th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCatalogProperties.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            No properties match your current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredCatalogProperties.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.main_image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                                  alt={p.title}
                                  className="w-14 h-11 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-extrabold text-slate-900 line-clamp-1">{p.title}</span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-0.5">
                                    <span className="font-mono text-slate-400">{p.property_code}</span>
                                    <span>•</span>
                                    <span>{p.bhk}</span>
                                    {p.carpet_area > 0 && (
                                      <>
                                        <span>•</span>
                                        <span>{p.carpet_area} sqft</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                p.listing_type === 'rent' ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-900'
                              }`}>
                                {p.listing_type === 'rent' ? 'Rent' : 'Sale'}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{p.area || p.city || 'Primary City'}</div>
                              <div className="text-[10px] text-slate-400">{p.locality || 'General Area'}</div>
                            </td>

                            <td className="px-4 py-3 font-mono font-bold text-slate-900">
                              {p.listing_type === 'rent' ? `₹${Number(p.price).toLocaleString('en-IN')}/mo` : `₹${Number(p.price).toLocaleString('en-IN')}`}
                            </td>

                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                                  (p.unlocks_count || 0) > 0
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                                title={`${p.unlocks_count || 0} clients paid ₹1,000 to unlock this property's exact address & owner contact`}
                              >
                                <Key className="w-3.5 h-3.5 inline mr-1 text-amber-600" /> {p.unlocks_count || 0}
                              </span>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <select
                                value={p.status || 'available'}
                                onChange={(e) => handleQuickStatusChange(p, e.target.value)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${
                                  p.status === 'available' || !p.status
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : p.status === 'reserved'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : p.status === 'draft'
                                    ? 'bg-slate-100 text-slate-600 border-slate-300'
                                    : 'bg-red-50 text-red-800 border-red-300'
                                }`}
                              >
                                <option value="available">Available</option>
                                <option value="reserved">Reserved</option>
                                <option value="rented">Rented</option>
                                <option value="sold">Sold</option>
                                <option value="draft">Draft</option>
                              </select>
                            </td>

                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`/property/${p.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-slate-400 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition"
                                  title="View Public Card"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => handleDuplicateProperty(p.id)}
                                  className="p-1.5 text-slate-500 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition"
                                  title="Duplicate as Draft"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingProperty({ ...p });
                                    setIsAddingProperty(false);
                                    setPropertySubTab('add');
                                  }}
                                  className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit Property"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => setDeletingProperty(p)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Delete Property"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3.4 USER DIRECTORY & LIVE AUDIENCE INTELLIGENCE */}
        {/* ========================================================================= */}
        {activeSection === 'accounts' && (
          <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
            {/* Header & Live Pulse Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-blue-900" />
                  <span>User Accounts & Live Audience</span>
                  <span className="bg-blue-100 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {registeredUsers.length} Registered
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monitor live visitors on site, registered members, saved property favorites, and direct engagement metrics.
                </p>
              </div>

              {/* Live Signal Indicator Pill */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800 shadow-2xs">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span>{liveAudience.totalLive} Active {liveAudience.totalLive === 1 ? 'User' : 'Users'} Online Now</span>
                </div>
                <button
                  type="button"
                  onClick={refreshData}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer shadow-2xs"
                  title="Refresh User Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Summary Cards (Compact, Balanced, Non-Overcrowded) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-900" /> Registered</span>
                  <span className="text-[10px] bg-blue-50 text-blue-900 px-1.5 py-0.5 rounded font-bold font-mono">Platform</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">{registeredUsers.length}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>Verified Accounts</span>
                  <span className="text-blue-900 font-bold">100% Genuine</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/30">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5 text-emerald-800"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Traffic</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">Real-Time</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-serif">{liveAudience.totalLive}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>{liveAudience.registeredLiveCount} of {registeredUsers.length} Member{registeredUsers.length === 1 ? '' : 's'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{liveAudience.guestLiveCount} Visitor{liveAudience.guestLiveCount === 1 ? '' : 's'}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs flex flex-col justify-between bg-gradient-to-br from-white to-rose-50/20">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5 text-rose-600"><Heart className="w-3.5 h-3.5 fill-rose-500" /> Property Likes</span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-bold font-mono">Catalog</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black text-rose-600 font-serif">
                    {registeredUsers.reduce((sum, u) => sum + (u.likesCount || 0), 0)}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>{registeredUsers.filter(u => u.likesCount > 0).length} Members Liked</span>
                  <span className="text-rose-600 font-bold">High Intent</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between bg-gradient-to-br from-white to-amber-50/20">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5 text-amber-700"><Key className="w-3.5 h-3.5" /> Address Unlocks</span>
                  <span className="text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded font-bold font-mono">Conversions</span>
                </div>
                <div className="my-2">
                  <div className="text-2xl sm:text-3xl font-black text-amber-600 font-serif">
                    {registeredUsers.reduce((sum, u) => sum + (u.unlocksCount || 0), 0)}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-2 flex items-center justify-between">
                  <span>Inspection Ready</span>
                  <span className="text-amber-800 font-bold">₹1,000 / lead</span>
                </div>
              </div>
            </div>

            {/* Live Session Activity Banner (Compact Strip showing active tabs) */}
            {liveAudience.sessions && liveAudience.sessions.length > 0 && (
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-300 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Visitor Footprint:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 overflow-x-auto scrollbar-none">
                  {liveAudience.sessions.slice(0, 6).map((sess, idx) => (
                    <span 
                      key={sess.sessionId || idx}
                      className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl text-[11px] text-slate-200 border border-white/10"
                    >
                      <span className="font-semibold text-amber-300">{sess.userName || 'Visitor'}:</span>
                      <span className="font-mono text-slate-300">{sess.path}</span>
                      <span className="text-[9px] text-slate-400">({sess.device})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Search, Filter & Sort Bar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or mobile number..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-900 transition"
                  />
                  {userSearchQuery && (
                    <button
                      onClick={() => setUserSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold shrink-0">Sort:</span>
                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer"
                  >
                    <option value="likes">Most Property Likes</option>
                    <option value="recent">Recently Registered</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Filter:</span>
                {[
                  { id: 'all', label: 'All Members', count: registeredUsers.length },
                  { id: 'online', label: 'Online Now', count: registeredUsers.filter(u => u.isOnline).length },
                  { id: 'with_likes', label: 'Has Likes', count: registeredUsers.filter(u => (u.likesCount || 0) > 0).length },
                  { id: 'with_unlocks', label: 'Unlocked Address', count: registeredUsers.filter(u => (u.unlocksCount || 0) > 0).length },
                  { id: 'with_visits', label: 'Booked Visits', count: registeredUsers.filter(u => (u.visitsCount || 0) > 0).length }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setUserFilterStatus(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      userFilterStatus === f.id
                        ? 'bg-blue-950 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      userFilterStatus === f.id ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                    }`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Users Directory Grid */}
            {(() => {
              const filtered = registeredUsers
                .filter((u) => {
                  if (userFilterStatus === 'online') return u.isOnline;
                  if (userFilterStatus === 'with_likes') return (u.likesCount || 0) > 0;
                  if (userFilterStatus === 'with_unlocks') return (u.unlocksCount || 0) > 0;
                  if (userFilterStatus === 'with_visits') return (u.visitsCount || 0) > 0;
                  return true;
                })
                .filter((u) => {
                  if (!userSearchQuery.trim()) return true;
                  const q = userSearchQuery.toLowerCase();
                  return (
                    u.name?.toLowerCase().includes(q) ||
                    u.email?.toLowerCase().includes(q) ||
                    u.phone?.includes(q)
                  );
                })
                .sort((a, b) => {
                  if (userSortBy === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
                  if (userSortBy === 'name') return (a.name || '').localeCompare(b.name || '');
                  return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                    <Users className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
                    <h3 className="text-sm font-bold text-slate-800">No users match this criteria</h3>
                    <p className="text-xs text-slate-500">Try changing your search term or filter selection.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between gap-4"
                    >
                      {/* Top Header of User Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-950 text-amber-400 font-black text-lg flex items-center justify-center shadow-xs">
                              {member.name ? member.name[0].toUpperCase() : 'U'}
                            </div>
                            {member.isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" title="Online Now" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold text-slate-900">{member.name}</h3>
                              {user && ((member.email && user.email && member.email.toLowerCase() === user.email.toLowerCase()) || String(member.id) === String(user.id)) ? (
                                <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                                  Master Admin (You)
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                                  Member
                                </span>
                              )}
                              {member.status === 'suspended' || member.isSuspended ? (
                                <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                                  <Ban className="w-2.5 h-2.5" /> Suspended
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Active
                                </span>
                              )}
                              {member.isOnline ? (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-600 animate-ping" /> Live
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  {member.lastActive}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                              {member.email && <span>{member.email}</span>}
                              {member.phone && <span>• {member.phone}</span>}
                            </div>
                          </div>
                        </div>

                        {/* User Actions: Suspend / Reactivate & Delete */}
                        <div className="flex items-center gap-1">
                          {user && ((member.email && user.email && member.email.toLowerCase() === user.email.toLowerCase()) || String(member.id) === String(user.id)) ? (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200" title="Active Master Administrator Account">
                              Master Account
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSuspendingUser(member);
                                  setSuspendReason(member.suspendReason || '');
                                }}
                                className={`p-1.5 rounded-lg transition cursor-pointer ${
                                  member.status === 'suspended' || member.isSuspended
                                    ? 'text-emerald-700 hover:bg-emerald-100 bg-emerald-50 border border-emerald-200'
                                    : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                }`}
                                title={
                                  member.status === 'suspended' || member.isSuspended
                                    ? 'Reactivate user account'
                                    : 'Suspend / Block user account'
                                }
                              >
                                {member.status === 'suspended' || member.isSuspended ? (
                                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <UserX className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setDeletingUser(member)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Permanently remove user account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Interactive Activity Counters Row */}
                      <div className="grid grid-cols-4 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <div 
                          onClick={() => setSelectedUserForModal(member)}
                          className="cursor-pointer hover:bg-white rounded-lg p-1 transition"
                          title="Click to view liked properties"
                        >
                          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                            <Heart className={`w-3 h-3 ${member.likesCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} /> Likes
                          </div>
                          <div className={`text-sm font-black mt-0.5 ${member.likesCount > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {member.likesCount || 0}
                          </div>
                        </div>

                        <div 
                          onClick={() => setSelectedUserForModal(member)}
                          className="cursor-pointer hover:bg-white rounded-lg p-1 transition"
                          title="Click to view unlocked addresses"
                        >
                          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                            <Key className="w-3 h-3 text-amber-500" /> Unlocks
                          </div>
                          <div className={`text-sm font-black mt-0.5 ${member.unlocksCount > 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                            {member.unlocksCount || 0}
                          </div>
                        </div>

                        <div 
                          onClick={() => setSelectedUserForModal(member)}
                          className="cursor-pointer hover:bg-white rounded-lg p-1 transition"
                          title="Click to view scheduled visits"
                        >
                          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-500" /> Visits
                          </div>
                          <div className="text-sm font-black text-slate-800 mt-0.5">
                            {member.visitsCount || 0}
                          </div>
                        </div>

                        <div 
                          onClick={() => setSelectedUserForModal(member)}
                          className="cursor-pointer hover:bg-white rounded-lg p-1 transition"
                          title="Click to view enquiries"
                        >
                          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
                            <MessageSquare className="w-3 h-3 text-indigo-500" /> Leads
                          </div>
                          <div className="text-sm font-black text-slate-800 mt-0.5">
                            {member.enquiriesCount || 0}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setSelectedUserForModal(member)}
                          className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect Activity & Likes ({member.likesCount || 0})
                        </button>

                        <div className="flex items-center gap-1.5">
                          {member.phone && (
                            <>
                              <a
                                href={`tel:${member.phone.replace(/\s+/g, '')}`}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                title="Call user"
                              >
                                <Phone className="w-3 h-3" /> Call
                              </a>
                              <a
                                href={`https://wa.me/${member.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${member.name}, this is Swapnil Navghare from Vedika Brokers Nanded desk. Connecting regarding your saved properties.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                                title="Chat on WhatsApp"
                              >
                                WhatsApp
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3.5 USER ENQUIRIES & LEADS MANAGEMENT (ZERO DATA LOSS & AUDIT HISTORY) */}
        {/* ========================================================================= */}
        {activeSection === 'enquiries' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header & Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-900" />
                  Customer Enquiries & Leads ({enquiries.length})
                </h1>
                <p className="text-xs text-slate-500">
                  Real-time record of all user queries, listing requests, and property leads across Nanded with permanent history.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportEnquiriesCSV}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Export filtered enquiries to CSV spreadsheet"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</div>
                <div className="text-xl font-black text-slate-900 font-serif mt-1">{enquiries.length}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">New / Action Required</div>
                <div className="text-xl font-black text-amber-600 font-serif mt-1">
                  {enquiries.filter(e => (e.status || 'new') === 'new').length}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">In Progress / Contacted</div>
                <div className="text-xl font-black text-blue-950 font-serif mt-1">
                  {enquiries.filter(e => e.status === 'contacted' || e.status === 'in_progress').length}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Resolved / Closed</div>
                <div className="text-xl font-black text-emerald-700 font-serif mt-1">
                  {enquiries.filter(e => e.status === 'resolved' || e.status === 'closed').length}
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, message, property code..."
                  value={enquirySearchQuery}
                  onChange={(e) => setEnquirySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                />
                {enquirySearchQuery && (
                  <button onClick={() => setEnquirySearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Source Filter */}
                <select
                  value={enquirySourceFilter}
                  onChange={(e) => setEnquirySourceFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="all">All Sources</option>
                  <option value="Contact Page">Contact Page</option>
                  <option value="Property Page">Property Page</option>
                  <option value="Direct Broker Desk">Direct Broker Desk</option>
                </select>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
                  {['all', 'new', 'contacted', 'in_progress', 'resolved', 'closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEnquiryStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors shrink-0 cursor-pointer ${
                        enquiryStatusFilter === st
                          ? 'bg-blue-900 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st === 'all' ? `All (${enquiries.length})` : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Enquiries List Cards with Full Detail, Notes & History */}
            {filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base font-serif">No Enquiries Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {enquirySearchQuery || enquiryStatusFilter !== 'all' || enquirySourceFilter !== 'all'
                    ? 'No user enquiries match your current search or filter criteria.'
                    : 'When prospective buyers and tenants submit enquiries through the contact desk or property pages, they will appear here.'}
                </p>
                {(enquirySearchQuery || enquiryStatusFilter !== 'all' || enquirySourceFilter !== 'all') && (
                  <button
                    onClick={() => { setEnquirySearchQuery(''); setEnquiryStatusFilter('all'); setEnquirySourceFilter('all'); }}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq) => {
                  const isExpanded = expandedHistoryId === enq.id;
                  const historyList = Array.isArray(enq.history) ? enq.history : [];
                  const notesList = Array.isArray(enq.admin_notes) ? enq.admin_notes : [];
                  const cleanPhone = (enq.phone || '').replace(/[^0-9+]/g, '');

                  return (
                    <div
                      key={enq.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 space-y-4"
                    >
                      {/* Top Bar: Customer Identity & Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-900 to-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {(enq.name || 'U').charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                                {enq.name || 'Anonymous Visitor'}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold">
                                #{enq.id}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 font-bold border border-blue-200">
                                {enq.source || 'Website'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>Received: {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(enq.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </p>
                          </div>
                        </div>

                        {/* Status Dropdown & Delete Action */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <span className="text-xs font-bold text-slate-500">Status:</span>
                          <select
                            value={enq.status || 'new'}
                            onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                            className={`text-xs font-black px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                              enq.status === 'new'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : enq.status === 'contacted'
                                ? 'bg-blue-100 text-blue-900 border-blue-300'
                                : enq.status === 'in_progress'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : enq.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="new">NEW (Unread)</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="in_progress">IN PROGRESS</option>
                            <option value="resolved">RESOLVED</option>
                            <option value="closed">CLOSED</option>
                          </select>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingEnquiry(enq);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                            title="Delete this enquiry record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Direct One-Click Communication Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {enq.phone && (
                          <>
                            <a
                              href={`tel:${cleanPhone}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold transition flex items-center gap-1.5 shadow-2xs"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-blue-900" />
                              <span>Call {enq.phone}</span>
                            </a>

                            <a
                              href={`https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name || 'there')},%20this%20is%20Swapnil%20Navghare%20from%20Vedika%20Brokers%20Nanded%20regarding%20your%20enquiry.`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition flex items-center gap-1.5 shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </>
                        )}

                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}?subject=Regarding%20your%20property%20enquiry%20with%20Vedika%20Brokers`}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-medium transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-700" />
                            <span>{enq.email}</span>
                          </a>
                        )}

                        {enq.property_code && (
                          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 font-bold text-xs flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Property: {enq.property_code} {enq.property_title ? `(${enq.property_title})` : ''}</span>
                          </span>
                        )}
                      </div>

                      {/* Customer Inquiry Message Box */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Customer Message / Requirement
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          "{enq.message || 'No written message provided.'}"
                        </p>
                      </div>

                      {/* Admin Notes Log & Quick Inline Note Input */}
                      <div className="space-y-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Broker Follow-Up Notes ({notesList.length})</span>
                          </span>
                        </div>

                        {notesList.length > 0 && (
                          <div className="space-y-1.5 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                            {notesList.map((n, idx) => (
                              <div key={n.id || idx} className="text-xs text-slate-700 flex items-start gap-2">
                                <span className="font-bold text-indigo-900 shrink-0">{n.by || 'Broker'}:</span>
                                <span className="flex-1 font-medium">{n.note}</span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline input to append new follow-up note */}
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Add broker follow-up note (e.g. Spoke on phone, client interested in 2 BHK near Station)..."
                            value={enquiryNoteInputs[enq.id] || ''}
                            onChange={(e) => setEnquiryNoteInputs({ ...enquiryNoteInputs, [enq.id]: e.target.value })}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddEnquiryNote(enq.id); }}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddEnquiryNote(enq.id)}
                            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-2xs transition shrink-0 cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>

                      {/* Audit & History Timeline Accordion (Never Loses Past History) */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setExpandedHistoryId(isExpanded ? null : enq.id)}
                          className="text-xs font-bold text-slate-600 hover:text-blue-950 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isExpanded ? 'Hide Audit History' : `View Full Audit History (${historyList.length} events)`}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2 animate-in fade-in duration-200">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-200">
                              Immutable Audit Timeline (Permanent Record)
                            </div>
                            <div className="space-y-2.5 pt-1 pl-2">
                              {historyList.map((hist, hIdx) => (
                                <div key={hIdx} className="relative pl-4 border-l-2 border-blue-900 text-xs space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{hist.action}</span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      {new Date(hist.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="text-slate-600 font-medium">{hist.details}</div>
                                  <div className="text-[10px] text-slate-400">Recorded by: <strong className="text-slate-600">{hist.by || 'System'}</strong></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SCHEDULED VISITS */}
        {/* ========================================================================= */}
        {activeSection === 'visits' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-700" />
                  Scheduled Visits ({visits.length})
                </h1>
                <p className="text-xs text-slate-500">Site inspections and physical appointment desk for buyers and tenants.</p>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</div>
                <div className="text-xl font-black text-slate-900 font-serif mt-1">{visits.length}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Confirm</div>
                <div className="text-xl font-black text-amber-600 font-serif mt-1">
                  {visits.filter(v => (v.status || 'pending') === 'pending').length}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Confirmed</div>
                <div className="text-xl font-black text-emerald-700 font-serif mt-1">
                  {visits.filter(v => v.status === 'confirmed').length}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Completed</div>
                <div className="text-xl font-black text-blue-950 font-serif mt-1">
                  {visits.filter(v => v.status === 'completed').length}
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search visitor, phone, property..."
                  value={visitSearchQuery}
                  onChange={(e) => setVisitSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                />
                {visitSearchQuery && (
                  <button onClick={() => setVisitSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative flex items-center gap-1 p-1 bg-gradient-to-r from-blue-950/15 via-amber-400/20 to-blue-900/15 backdrop-blur-md border border-amber-400/35 ring-1 ring-blue-500/15 rounded-xl sm:rounded-full overflow-x-auto w-full sm:w-auto scrollbar-none">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setVisitStatusFilter(st)}
                    className={`relative px-3 py-1.5 rounded-lg sm:rounded-full text-xs font-bold capitalize transition-colors shrink-0 cursor-pointer ${
                      visitStatusFilter === st
                        ? 'text-white font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {visitStatusFilter === st && (
                      <motion.div
                        layoutId="visitStatusFilterIndicator"
                        className="absolute inset-0 bg-blue-900 rounded-lg sm:rounded-full shadow-xs border border-amber-400/50 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">
                      {st === 'all' ? `All (${visits.length})` : st}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Visitor</th>
                      <th className="px-4 py-3">Contact Desk</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">Time Slot</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisits.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          {visits.length === 0 ? 'No visits scheduled yet.' : 'No visits match your search or filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredVisits.map((v) => {
                        const cleanPhone = (v.phone || '').replace(/\D/g, '');
                        return (
                          <tr key={v.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3 font-bold text-slate-900">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                                  {(v.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="font-extrabold">{v.name}</span>
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-700 font-mono font-bold">{v.phone}</span>
                                {cleanPhone && (
                                  <>
                                    <a
                                      href={`https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=Hello%20${encodeURIComponent(v.name || 'Sir')},%20regarding%20your%20scheduled%20visit%20at%20Vedika%20Brokers...`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                      title="Chat on WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                    <a
                                      href={`tel:${v.phone}`}
                                      className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 transition"
                                      title="Call Visitor"
                                    >
                                      <PhoneCall className="w-3.5 h-3.5" />
                                    </a>
                                  </>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <span className="font-bold text-slate-800 block truncate max-w-xs">{v.property?.title || v.property_id}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{v.property?.area || v.property?.city || 'Local Area'}</span>
                            </td>

                            <td className="px-4 py-3 text-slate-600 font-medium">
                              <div>{v.preferred_date ? new Date(v.preferred_date).toLocaleDateString('en-IN') : 'Flexible'}</div>
                              <div className="text-[10px] text-slate-400">{v.preferred_time || 'Daytime'}</div>
                            </td>

                            <td className="px-4 py-3 text-center">
                              <select
                                value={v.status || 'pending'}
                                onChange={async (e) => {
                                  await dataStore.updateVisitStatus(v.id, e.target.value);
                                  refreshData();
                                }}
                                className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                                  v.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : v.status === 'completed'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : v.status === 'cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="px-4 py-3 text-right">
                              {v.status !== 'confirmed' && (
                                <button
                                  onClick={async () => {
                                    await dataStore.updateVisitStatus(v.id, 'confirmed');
                                    refreshData();
                                  }}
                                  className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] hover:bg-emerald-700 transition flex items-center gap-1 ml-auto"
                                >
                                  <Check className="w-3.5 h-3.5" /> Confirm
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. REFUNDS (₹500 POST-VISIT CLAIMS) */}
        {/* ========================================================================= */}
        {activeSection === 'refunds' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <RotateCcw className="w-6 h-6 text-rose-600" />
                  ₹500 Visit Refund Queue ({refunds.length})
                </h1>
                <p className="text-xs text-slate-500">Disburse or review ₹500 visit refunds directly to user UPI IDs.</p>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Claims</div>
                <div className="text-xl font-black text-slate-900 font-serif mt-1">{refunds.length}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Review</div>
                <div className="text-xl font-black text-amber-600 font-serif mt-1">
                  {pendingRefundsCount} (₹{(pendingRefundsCount * 500).toLocaleString('en-IN')})
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Settled & Paid</div>
                <div className="text-xl font-black text-emerald-700 font-serif mt-1">
                  {refunds.filter(r => r.status === 'processed').length} (₹{(refunds.filter(r => r.status === 'processed').length * 500).toLocaleString('en-IN')})
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Rejected</div>
                <div className="text-xl font-black text-rose-600 font-serif mt-1">
                  {refunds.filter(r => r.status === 'rejected').length}
                </div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Claim ID, UPI ID, Property..."
                  value={refundSearchQuery}
                  onChange={(e) => setRefundSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                />
                {refundSearchQuery && (
                  <button onClick={() => setRefundSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative flex items-center gap-1 p-1 bg-gradient-to-r from-blue-950/15 via-amber-400/20 to-blue-900/15 backdrop-blur-md border border-amber-400/35 ring-1 ring-blue-500/15 rounded-xl sm:rounded-full overflow-x-auto w-full sm:w-auto scrollbar-none">
                {['all', 'pending', 'processed', 'rejected'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRefundStatusFilter(st)}
                    className={`relative px-3 py-1.5 rounded-lg sm:rounded-full text-xs font-bold capitalize transition-colors shrink-0 cursor-pointer ${
                      refundStatusFilter === st
                        ? 'text-white font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {refundStatusFilter === st && (
                      <motion.div
                        layoutId="refundStatusFilterIndicator"
                        className="absolute inset-0 bg-blue-900 rounded-lg sm:rounded-full shadow-xs border border-amber-400/50 z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">
                      {st === 'all' ? `All (${refunds.length})` : st === 'processed' ? 'Paid' : st}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Claim ID</th>
                      <th className="px-4 py-3">Property</th>
                      <th className="px-4 py-3">User UPI ID</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3 text-center">Amount</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRefunds.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          {refunds.length === 0 ? 'No refund requests found.' : 'No refund claims match your search or filter.'}
                        </td>
                      </tr>
                    ) : (
                      filteredRefunds.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.id}</td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-800 block truncate max-w-xs">{r.property?.title || r.property_id}</span>
                            <span className="text-[10px] text-slate-400">{r.property?.area || r.property?.city || 'Local Area'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 font-mono text-blue-900 font-bold">
                              <span>{r.user_upi_id}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(r.user_upi_id);
                                  alert(`Copied UPI ID: ${r.user_upi_id}`);
                                }}
                                className="p-1 text-slate-400 hover:text-blue-900"
                                title="Copy UPI ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs truncate text-slate-600">{r.reason || 'Visited property; not proceeding'}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-900 font-mono">₹{r.amount || 500}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'processed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {r.status === 'processed' ? 'Paid' : r.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {r.status !== 'processed' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={async () => {
                                    await dataStore.updateRefundStatus(r.id, 'processed', 'Processed via UPI');
                                    alert(`Refund ${r.id} marked as paid.`);
                                    refreshData();
                                  }}
                                  className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-[10px] hover:bg-emerald-700 transition flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Mark Paid
                                </button>
                                <button
                                  onClick={async () => {
                                    await dataStore.updateRefundStatus(r.id, 'rejected', 'Refund request rejected');
                                    refreshData();
                                  }}
                                  className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded-lg text-[10px] hover:bg-red-200 transition flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. PAYMENTS & LEDGER */}
        {/* ========================================================================= */}
        {activeSection === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-700" />
                  Address Unlock Payments Ledger ({payments.length})
                </h1>
                <p className="text-xs text-slate-500">Audit trail of ₹1,000 unlocks paid by prospective tenants and buyers across listings.</p>
              </div>
            </div>

            {/* Quick Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Unlocks Revenue</div>
                  <div className="text-lg font-black text-slate-900 font-mono">
                    ₹{(payments.length * (settings.unlock_fee || 1000)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Unlocks</div>
                  <div className="text-lg font-black text-slate-900 font-mono">
                    {payments.length} Transactions
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Channels</div>
                  <div className="text-xs font-black text-slate-800">
                    Razorpay & Direct UPI
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Txn ID, User Phone, Property Code..."
                  value={paymentSearchQuery}
                  onChange={(e) => setPaymentSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                />
                {paymentSearchQuery && (
                  <button onClick={() => setPaymentSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono hidden sm:inline">
                Showing {filteredPayments.length} of {payments.length} Transactions
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Txn ID</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">User Phone / ID</th>
                      <th className="px-4 py-3">Property Code</th>
                      <th className="px-4 py-3">Gateway Ref</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          {payments.length === 0 ? 'No transactions recorded yet.' : 'No transactions match your search.'}
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3 font-mono font-bold text-slate-900">{p.id}</td>
                          <td className="px-4 py-3 text-slate-500">{new Date(p.created_at).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-mono text-slate-700 font-medium">{p.user_id}</td>
                          <td className="px-4 py-3 font-mono text-blue-900 font-bold">{p.property_id}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{p.razorpay_payment_id || 'Direct UPI'}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-black text-xs font-mono border border-emerald-200">
                              ₹{p.amount || 1000}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. WEBSITE CONTENT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeSection === 'content' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <FileText className="w-6 h-6 text-amber-500" />
                  Website Content & Policies
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure brand identity, official contacts, and pricing rules shown to public users.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left 2 Cols: Brand & Notices */}
              <div className="lg:col-span-2 space-y-5">
                {/* Brand & Contacts */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Building2 className="w-4 h-4 text-blue-900" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Brand Identity & Official Contacts
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Website Brand Name</label>
                      <input
                        type="text"
                        value={settings.website_name || 'VEDIKA BROKERS'}
                        onChange={(e) => setSettings({ ...settings, website_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Homepage Tagline</label>
                      <input
                        type="text"
                        value={settings.tagline || "Nanded's Verified Property Network"}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Support Phone</label>
                      <input
                        type="text"
                        value={settings.phone || '+91 93701 48697'}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">WhatsApp Desk (without +)</label>
                      <input
                        type="text"
                        value={settings.whatsapp || '919370148697'}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        value={settings.email || 'contact@vedikabrokers.com'}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Head Office Address</label>
                      <input
                        type="text"
                        value={settings.office_address || 'Office 304, Vedika Tower, Near Zenda Chowk, Vazirabad, Nanded, Maharashtra - 431601'}
                        onChange={(e) => setSettings({ ...settings, office_address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Public Notices */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <FileText className="w-4 h-4 text-blue-900" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Public Hero & Policy Notices
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Homepage Hero Subtitle</label>
                      <textarea
                        rows={2}
                        value={settings.hero_subtitle || 'Verified properties for rent and purchase in Zenda Chowk, Chhatrapati Chowk, Vazirabad, and across Nanded.'}
                        onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Refund Policy Explanation Note</label>
                      <textarea
                        rows={2}
                        value={settings.refund_policy_note || '₹500 refundable upon viewing confirmation if you decide not to proceed, subject to policy verification.'}
                        onChange={(e) => setSettings({ ...settings, refund_policy_note: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Pricing Rules & Save Action */}
              <div className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <IndianRupee className="w-4 h-4 text-blue-900" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Pricing & Refund Rules
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Address Unlock Fee (₹)</label>
                      <input
                        type="number"
                        value={settings.unlock_fee || 1000}
                        onChange={(e) => setSettings({ ...settings, unlock_fee: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 font-mono focus:outline-none focus:border-blue-900 bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Post-Visit Refund Guarantee (₹)</label>
                      <input
                        type="number"
                        value={settings.refund_amount || 500}
                        onChange={(e) => setSettings({ ...settings, refund_amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-emerald-800 font-mono focus:outline-none focus:border-emerald-600 bg-emerald-50/50"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-amber-700" /> Consumer Protection Desk
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Prospective tenants pay ₹{settings.unlock_fee || 1000} to reveal property coordinates. ₹{settings.refund_amount || 500} is refundable via UPI if inspection does not proceed to agreement.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Save All Content Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. SETTINGS & SYSTEM BACKUPS */}
        {/* ========================================================================= */}
        {activeSection === 'settings' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-700" />
                  Desk Settings & Data Snapshots
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export database backups, restore platform snapshots, and inspect platform storage health.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column (2 cols): Database Backup & Disaster Recovery */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <Layers className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Database Snapshots & Recovery
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Safely export your properties, operational localities, payment records, client visits, and system configurations into an offline JSON snapshot, or restore from a previously exported backup file.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Export Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                        <Download className="w-4 h-4 text-blue-900" />
                        <span>Export Live Backup</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Download full JSON snapshot including {properties.length} listings, {areas.length} localities, and payment ledger.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadBackup}
                      className="w-full py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download JSON Backup
                    </button>
                  </div>

                  {/* Restore Box */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-blue-950 text-xs">
                        <Upload className="w-4 h-4 text-blue-900" />
                        <span>Restore Snapshot</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Restore records from an existing .json backup. Updates all data stores after confirmation.
                      </p>
                    </div>
                    <label className="w-full py-2.5 px-3.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-950 text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Restore from JSON File
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    <strong>Notice:</strong> Restoring an external backup updates listings and locality registers. Always download a fresh backup before performing a restore.
                  </span>
                </div>
              </div>

              {/* Right Column (1 col): Platform Data Overview */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Activity className="w-4 h-4 text-blue-900" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Storage Record Pulse
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <Building2 className="w-4 h-4 text-blue-900 mb-1" />
                      <div className="text-base font-black text-slate-900">{properties.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Properties</div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <MapPin className="w-4 h-4 text-amber-600 mb-1" />
                      <div className="text-base font-black text-slate-900">{areas.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Localities</div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <Calendar className="w-4 h-4 text-indigo-700 mb-1" />
                      <div className="text-base font-black text-slate-900">{visits.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Visits</div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <RotateCcw className="w-4 h-4 text-rose-600 mb-1" />
                      <div className="text-base font-black text-slate-900">{refunds.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Refunds</div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
                      <div className="text-base font-black text-slate-900">{payments.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Payments</div>
                    </div>
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70 flex flex-col items-center justify-center text-center">
                      <Clock className="w-4 h-4 text-slate-600 mb-1" />
                      <div className="text-base font-black text-slate-900">{logs.length}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Logs</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-medium">Storage Engine:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Local Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeSection === 'logs' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
                  <Clock className="w-6 h-6 text-slate-700" />
                  Audit Trail & Security Activity
                  <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {filteredLogs.length} of {logs.length}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chronological history of admin actions, location updates, and unlocked records.
                </p>
              </div>
            </div>

            {/* Integrated Log Console */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              {/* Header / Toolbar */}
              <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div className="w-full md:w-72 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search audit actions..."
                    value={logSearchQuery}
                    onChange={(e) => setLogSearchQuery(e.target.value)}
                    className="bg-transparent w-full focus:outline-none font-medium placeholder:text-slate-400"
                  />
                  {logSearchQuery && (
                    <button onClick={() => setLogSearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0 scrollbar-none">
                  {[
                    { id: 'all', label: 'All Logs', count: logs.length },
                    { id: 'property', label: 'Properties', count: logs.filter(l => (l.entity || '').toLowerCase().includes('prop')).length },
                    { id: 'area', label: 'Localities', count: logs.filter(l => (l.entity || '').toLowerCase().includes('area') || (l.entity || '').toLowerCase().includes('loc')).length },
                    { id: 'payment', label: 'Payments', count: logs.filter(l => (l.entity || '').toLowerCase().includes('pay')).length },
                    { id: 'settings', label: 'Settings', count: logs.filter(l => (l.entity || '').toLowerCase().includes('set')).length },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLogEntityFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap text-xs cursor-pointer flex items-center gap-1.5 ${
                        logEntityFilter === f.id
                          ? 'bg-blue-900 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        logEntityFilter === f.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {f.count}
                      </span>
                    </button>
                  ))}

                  {(logSearchQuery || logEntityFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setLogSearchQuery('');
                        setLogEntityFilter('all');
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logs Stream */}
              <div className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-medium">No activity logs matching your search or filter.</p>
                    {(logSearchQuery || logEntityFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setLogSearchQuery('');
                          setLogEntityFilter('all');
                        }}
                        className="text-blue-900 font-bold hover:underline inline-block mt-1 cursor-pointer"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    const entityLower = (log.entity || '').toLowerCase();
                    const renderLogIcon = () => {
                      if (entityLower.includes('prop')) return <Building2 className="w-4 h-4 text-blue-900" />;
                      if (entityLower.includes('area') || entityLower.includes('loc')) return <MapPin className="w-4 h-4 text-amber-600" />;
                      if (entityLower.includes('pay')) return <CreditCard className="w-4 h-4 text-emerald-600" />;
                      if (entityLower.includes('set')) return <Settings className="w-4 h-4 text-slate-700" />;
                      if (entityLower.includes('visit')) return <Calendar className="w-4 h-4 text-indigo-700" />;
                      if (entityLower.includes('refund')) return <RotateCcw className="w-4 h-4 text-rose-600" />;
                      return <Clock className="w-4 h-4 text-slate-500" />;
                    };

                    const getEntityBadgeStyle = () => {
                      if (entityLower.includes('prop')) return 'bg-blue-50 text-blue-900 border-blue-200';
                      if (entityLower.includes('area') || entityLower.includes('loc')) return 'bg-amber-50 text-amber-900 border-amber-200';
                      if (entityLower.includes('pay')) return 'bg-emerald-50 text-emerald-900 border-emerald-200';
                      if (entityLower.includes('set')) return 'bg-slate-100 text-slate-800 border-slate-200';
                      if (entityLower.includes('visit')) return 'bg-indigo-50 text-indigo-900 border-indigo-200';
                      if (entityLower.includes('refund')) return 'bg-rose-50 text-rose-900 border-rose-200';
                      return 'bg-slate-50 text-slate-700 border-slate-200';
                    };

                    return (
                      <div key={log.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/70 transition">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            {renderLogIcon()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">{log.action}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getEntityBadgeStyle()}`}>
                                {log.entity}
                              </span>
                              {log.entity_id && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {log.entity_id}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium whitespace-nowrap">
                          {new Date(log.date).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. ADD / EDIT AREA MODAL */}
      {(isAddingArea || editingArea) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                {editingArea?.id ? `Edit Area: ${editingArea.name}` : 'Add Locality / Area'}
              </h3>
              <button
                onClick={() => { setEditingArea(null); setIsAddingArea(false); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingArea?.id && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Cascading Rename:</strong> If you change the area name from "{editingArea.name}", all properties in that area will automatically be updated with the new name!
                </span>
              </div>
            )}

            <form onSubmit={handleSaveArea} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Locality Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingArea?.name || ''}
                  onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                  placeholder="e.g. Vazirabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Operating City <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingArea?.city_id || cities[0]?.id || ''}
                  onChange={(e) => {
                    const sel = cities.find(c => c.id === e.target.value);
                    setEditingArea({
                      ...editingArea,
                      city_id: sel ? sel.id : e.target.value,
                      city_name: sel ? sel.name : 'Nanded'
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-xs focus:outline-none focus:border-blue-900 bg-white"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.state} {c.is_primary ? '(Primary Platform City)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sub-Areas & Key Landmarks (Comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingArea?.sub_areas) ? editingArea.sub_areas.join(', ') : (editingArea?.sub_areas || '')}
                  onChange={(e) => {
                    const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingArea({ ...editingArea, sub_areas: parsed });
                  }}
                  placeholder="e.g. Main Market, Station Road, City Square"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Appear as quick 1-click suggestions when creating properties.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Area Description & Connectivity</label>
                <textarea
                  rows={2}
                  value={editingArea?.description || ''}
                  onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })}
                  placeholder="Brief note on connectivity, amenities, and lifestyle..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Priority</label>
                  <input
                    type="number"
                    value={editingArea?.display_order || 1}
                    onChange={(e) => setEditingArea({ ...editingArea, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-bold focus:outline-none"
                  />
                </div>

                <div className="pt-5 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingArea?.is_popular || false}
                      onChange={(e) => setEditingArea({ ...editingArea, is_popular: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Popular Locality</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={editingArea?.active !== false}
                      onChange={(e) => setEditingArea({ ...editingArea, active: e.target.checked })}
                      className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingArea(null); setIsAddingArea(false); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold shadow transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 inline mr-1" /> Save Locality
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SAFE DELETE AREA WITH PROPERTY REASSIGNMENT MODAL */}
      {deletingArea && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Area: {deletingArea.name}</h3>
                <p className="text-slate-500">Safely manage associated property data before removal.</p>
              </div>
            </div>

            {(() => {
              const count = getPropertyCountForArea(deletingArea.name);
              const otherAreas = areas.filter(a => a.id !== deletingArea.id);

              return (
                <div className="space-y-3">
                  {count > 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 space-y-2">
                      <p className="font-bold">
                        This area currently has {count} properties assigned to it.
                      </p>
                      <p className="text-[11px] text-amber-800">
                        To protect your property data, select where these properties should be reassigned:
                      </p>
                      <select
                        value={reassignTargetArea}
                        onChange={(e) => setReassignTargetArea(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                      >
                        <option value={cities[0]?.name || 'General City Area'}>General {cities[0]?.name || 'City'} Area</option>
                        {otherAreas.map(a => (
                          <option key={a.id} value={a.name}>
                            Reassign to: {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-slate-600">
                      There are currently 0 properties assigned to this area. It can be safely removed.
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setDeletingArea(null)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDeleteArea}
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" /> Confirm Delete
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 3. SAFE DELETE PROPERTY MODAL */}
      {deletingProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Property?</h3>
              <p className="text-slate-500 mt-1">
                Are you sure you want to delete <strong>"{deletingProperty.title}"</strong> ({deletingProperty.property_code})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProperty(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProperty}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow transition flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD / EDIT CITY MODAL */}
      {editingCity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-900" />
                  {isAddingCity || !editingCity.id ? 'Add New Operating City' : `Edit City: ${editingCity.name}`}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isAddingCity || !editingCity.id
                    ? 'Add a new city to the platform. Existing cities and listings will remain unchanged.'
                    : 'Update city metadata and settings.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingCity(null); setIsAddingCity(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCity} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCity.name || ''}
                  onChange={(e) => setEditingCity({ ...editingCity, name: e.target.value })}
                  placeholder="e.g. Pune, Mumbai, Hyderabad, Chhatrapati Sambhajinagar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-blue-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingCity.state || 'Maharashtra'}
                    onChange={(e) => setEditingCity({ ...editingCity, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={editingCity.pincode || ''}
                    onChange={(e) => setEditingCity({ ...editingCity, pincode: e.target.value })}
                    placeholder="e.g. 411001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-medium focus:outline-none focus:border-blue-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Overview</label>
                <textarea
                  rows={2}
                  value={editingCity.description || ''}
                  onChange={(e) => setEditingCity({ ...editingCity, description: e.target.value })}
                  placeholder="Brief description of this city's real estate market..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:outline-none focus:border-blue-900 text-xs"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingCity.is_primary || false}
                    onChange={(e) => setEditingCity({ ...editingCity, is_primary: e.target.checked })}
                    className="rounded border-slate-300 text-blue-900 focus:ring-blue-900 w-4 h-4"
                  />
                  <span>Set as Primary Platform City</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingCity.active !== false}
                    onChange={(e) => setEditingCity({ ...editingCity, active: e.target.checked })}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Active for Property Listings & Localities</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingCity(null); setIsAddingCity(false); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isAddingCity || !editingCity.id ? (
                    <>
                      <Plus className="w-4 h-4 inline mr-1" /> Add City
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 inline mr-1" /> Update City
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SAFE DELETE CUSTOMER ENQUIRY MODAL */}
      {deletingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Delete Customer Enquiry?</h3>
              <p className="text-slate-500 mt-1">
                Are you sure you want to permanently delete the enquiry from <strong>"{deletingEnquiry.name || 'Anonymous Visitor'}"</strong> ({deletingEnquiry.phone || 'No phone'})?
              </p>
              {deletingEnquiry.message && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-slate-600 italic line-clamp-2 text-[11px]">
                  "{deletingEnquiry.message}"
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEnquiry}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. USER ACTIVITY DETAILS MODAL */}
      {selectedUserForModal && (
        <UserActivityModal
          user={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
        />
      )}

      {/* 7. REMOVE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">Remove User Account?</h3>
              <p className="text-slate-500 mt-1">
                Are you sure you want to remove <strong>"{deletingUser.name}"</strong> ({deletingUser.email})?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deletingUser)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUSPEND / REACTIVATE USER CONFIRMATION MODAL */}
      {suspendingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              suspendingUser.status === 'suspended' || suspendingUser.isSuspended
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-amber-100 text-amber-600'
            }`}>
              {suspendingUser.status === 'suspended' || suspendingUser.isSuspended ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <UserX className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {suspendingUser.status === 'suspended' || suspendingUser.isSuspended
                  ? 'Reactivate User Account?'
                  : 'Suspend User Account?'}
              </h3>
              <p className="text-slate-500 mt-1">
                {suspendingUser.status === 'suspended' || suspendingUser.isSuspended ? (
                  <>Reactivate access for <strong>"{suspendingUser.name}"</strong> ({suspendingUser.email}). They will be able to log in again.</>
                ) : (
                  <>Suspending <strong>"{suspendingUser.name}"</strong> ({suspendingUser.email}) will immediately terminate their active session and prevent them from logging in.</>
                )}
              </p>
            </div>

            {!(suspendingUser.status === 'suspended' || suspendingUser.isSuspended) && (
              <div className="text-left space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase">Reason for Suspension (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Terms violation, spam inquiries"
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 bg-slate-50"
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuspendingUser(null);
                  setSuspendReason('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspendUser}
                className={`px-5 py-2 rounded-xl text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                  suspendingUser.status === 'suspended' || suspendingUser.isSuspended
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {suspendingUser.status === 'suspended' || suspendingUser.isSuspended ? (
                  <><UserCheck className="w-4 h-4 inline mr-1" /> Yes, Reactivate</>
                ) : (
                  <><UserX className="w-4 h-4 inline mr-1" /> Yes, Suspend Account</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
