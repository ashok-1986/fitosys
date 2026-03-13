"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { NavBar } from "@/components/ui/navigation";
import { User, Bell, CreditCard, Save, Trash2, AlertTriangle } from "lucide-react";
import { deleteAccountAction } from "@/app/actions/delete-account";
import { useToast } from "@/hooks/use-toast";

interface CoachProfile {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  timezone: string;
  coaching_type: string[];
  business_name?: string;
  gst_number?: string;
  billing_address?: string;
  checkin_day: number;
  checkin_time: string;
}

type SettingsTab = "profile" | "notifications" | "billing";

const COACHING_TYPES = [
  { value: "fitness", label: "Fitness" },
  { value: "yoga", label: "Yoga" },
  { value: "wellness", label: "Wellness" },
  { value: "nutrition", label: "Nutrition" },
];

const DAYS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    whatsapp_number: "",
    coaching_type: [] as string[],
    business_name: "",
    gst_number: "",
    billing_address: "",
    checkin_day: "0",
    checkin_time: "19:00",
    whatsapp_notifications: true,
    email_notifications: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/coaches/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        whatsapp_number: data.whatsapp_number || "",
        coaching_type: data.coaching_type || [],
        business_name: data.business_name || "",
        gst_number: data.gst_number || "",
        billing_address: data.billing_address || "",
        checkin_day: String(data.checkin_day || 0),
        checkin_time: data.checkin_time || "19:00",
        whatsapp_notifications: true,
        email_notifications: false,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/coaches/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          whatsapp_number: formData.whatsapp_number,
          coaching_type: formData.coaching_type,
          business_name: formData.business_name,
          gst_number: formData.gst_number,
          billing_address: formData.billing_address,
          checkin_day: parseInt(formData.checkin_day),
          checkin_time: formData.checkin_time,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveNotifications() {
    setLoading(true);
    try {
      // In production: create API endpoint for notification preferences
      // For now, just show success message
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving notifications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(formData: FormData) {
    setLoading(true);
    try {
      const result = await deleteAccountAction(formData);
      if (result.success) {
        showSuccess(result.message);
        setShowDeleteDialog(false);
        // Redirect to home after 3 seconds
        setTimeout(() => window.location.href = "/", 3000);
      } else {
        showError(result.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showError("Account deletion failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar
        title="Settings"
        back="Home"
        backHref="/dashboard"
      />

      {/* Tab Navigation */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex gap-2 border-b border-white/10">
          <TabButton
            icon={<User className="h-4 w-4" />}
            label="Profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <TabButton
            icon={<CreditCard className="h-4 w-4" />}
            label="Billing"
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          />
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="px-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coach Profile</CardTitle>
              <CardDescription>Update your personal and business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label>Coaching Types</Label>
                <div className="flex flex-wrap gap-2">
                  {COACHING_TYPES.map((type) => (
                    <Badge
                      key={type.value}
                      variant={formData.coaching_type.includes(type.value) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          coaching_type: formData.coaching_type.includes(type.value)
                            ? formData.coaching_type.filter((t) => t !== type.value)
                            : [...formData.coaching_type, type.value],
                        });
                      }}
                    >
                      {type.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-3">Business Information (for invoices)</p>
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="Your coaching business name"
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <Label htmlFor="gst">GST Number (optional)</Label>
                  <Input
                    id="gst"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                    placeholder="29ABCDE1234F1Z5"
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <Label htmlFor="address">Billing Address</Label>
                  <Textarea
                    id="address"
                    value={formData.billing_address}
                    onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                    placeholder="Your business address"
                    rows={3}
                  />
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-3">Check-in Schedule</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkin_day">Check-in Day</Label>
                    <Select
                      value={formData.checkin_day}
                      onValueChange={(value) => setFormData({ ...formData, checkin_day: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkin_time">Check-in Time</Label>
                    <Input
                      id="checkin_time"
                      type="time"
                      value={formData.checkin_time}
                      onChange={(e) => setFormData({ ...formData, checkin_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="px-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">WhatsApp Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive client check-in replies and alerts on WhatsApp
                  </p>
                </div>
                <Switch
                  checked={formData.whatsapp_notifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, whatsapp_notifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries and invoices via email
                  </p>
                </div>
                <Switch
                  checked={formData.email_notifications}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, email_notifications: checked })
                  }
                />
              </div>
              <Button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="px-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-brand/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-lg">Pro Plan</p>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ₹2,999/month • Next billing on April 1, 2026
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clients enrolled</span>
                    <span>12 / 50</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-brand h-2 rounded-full" style={{ width: "24%" }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    38 clients remaining on your plan
                  </p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                Upgrade Plan
              </Button>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-destructive/20">
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-destructive">Danger Zone</h4>
                      <p className="text-xs text-destructive/80 mt-1">
                        Once deleted, your account cannot be recovered after 30 days
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-3"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Delete Account?</CardTitle>
              <CardDescription>
                This action cannot be undone after 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                <p className="text-sm text-destructive">
                  ⚠️ Warning: This will:
                </p>
                <ul className="text-xs text-destructive/80 mt-2 space-y-1 ml-4 list-disc">
                  <li>Deactivate all your programs</li>
                  <li>Cancel all active client enrollments</li>
                  <li>Schedule your data for permanent deletion in 30 days</li>
                  <li>Remove access to your dashboard</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmEmail">Type your email to confirm</Label>
                <form action={handleDelete}>
                  <Input
                    id="confirmEmail"
                    type="email"
                    placeholder={profile?.email || "your@email.com"}
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    name="confirmEmail"
                    required
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowDeleteDialog(false);
                        setDeleteConfirmEmail("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      className="flex-1"
                      disabled={deleteConfirmEmail !== profile?.email || loading}
                    >
                      {loading ? "Deleting..." : "Delete Account"}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "border-brand text-white"
          : "border-transparent text-white/40 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
