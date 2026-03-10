"use client";

import { useEffect, useState } from "react";
import { Settings, User, Clock, CreditCard, MessageSquare, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useApiData, apiMutate } from "@/lib/hooks";

interface CoachProfile {
    full_name: string;
    email: string;
    whatsapp_number: string;
    country_code: string;
    timezone: string;
    checkin_day: number;
    checkin_time: string;
}

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const TIMEZONES = [
    "Asia/Kolkata",
    "Europe/London",
    "America/New_York",
    "America/Toronto",
    "Asia/Dubai",
    "Australia/Sydney",
    "Asia/Singapore",
];

export default function SettingsPage() {
    const { data: coach, loading } = useApiData<CoachProfile>("/api/coaches/profile");

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        whatsapp_number: "",
        country_code: "",
        timezone: "Asia/Kolkata",
    });
    const [checkin, setCheckin] = useState({
        day: "0",
        time: "18:00",
    });
    const [saved, setSaved] = useState("");
    const [saving, setSaving] = useState("");

    useEffect(() => {
        if (coach) {
            setProfile({
                full_name: coach.full_name || "",
                email: coach.email || "",
                whatsapp_number: coach.whatsapp_number || "",
                country_code: coach.country_code || "",
                timezone: coach.timezone || "Asia/Kolkata",
            });
            setCheckin({
                day: (coach.checkin_day ?? 0).toString(),
                time: coach.checkin_time || "18:00",
            });
        }
    }, [coach]);

    const handleSaveProfile = async () => {
        setSaving("profile");
        await apiMutate("/api/coaches/profile", "PUT", profile);
        setSaved("profile");
        setSaving("");
        setTimeout(() => setSaved(""), 2000);
    };

    const handleSaveCheckin = async () => {
        setSaving("checkin");
        await apiMutate("/api/coaches/settings", "PUT", {
            checkin_day: parseInt(checkin.day),
            checkin_time: checkin.time,
            timezone: profile.timezone,
        });
        setSaved("checkin");
        setSaving("");
        setTimeout(() => setSaved(""), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6 text-brand" />
                    Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={profile.full_name}
                                onChange={(e) =>
                                    setProfile({ ...profile, full_name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={profile.email}
                                onChange={(e) =>
                                    setProfile({ ...profile, email: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>WhatsApp Number</Label>
                            <Input
                                value={profile.whatsapp_number}
                                onChange={(e) =>
                                    setProfile({ ...profile, whatsapp_number: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Timezone</Label>
                            <Select
                                value={profile.timezone}
                                onValueChange={(v) =>
                                    setProfile({ ...profile, timezone: v })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIMEZONES.map((tz) => (
                                        <SelectItem key={tz} value={tz}>
                                            {tz}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        onClick={handleSaveProfile}
                        disabled={saving === "profile"}
                        className="bg-brand hover:bg-brand/90 text-white"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {saved === "profile" ? "Saved ✓" : "Save Profile"}
                    </Button>
                </CardContent>
            </Card>

            {/* Check-in Configuration */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Check-in Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Automatic check-in messages are sent to all active clients at this
                        time.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Day of Week</Label>
                            <Select
                                value={checkin.day}
                                onValueChange={(v) => setCheckin({ ...checkin, day: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DAYS.map((day, i) => (
                                        <SelectItem key={i} value={i.toString()}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={checkin.time}
                                onChange={(e) =>
                                    setCheckin({ ...checkin, time: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleSaveCheckin}
                        disabled={saving === "checkin"}
                        className="bg-brand hover:bg-brand/90 text-white"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {saved === "checkin" ? "Saved ✓" : "Save Schedule"}
                    </Button>
                </CardContent>
            </Card>

            {/* Billing */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Billing
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Current Plan</p>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />Active
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Basic Monthly — ₹1,499/month</p>
                        </div>
                        <Button variant="outline" size="sm">
                            Manage Billing
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Integration */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp Integration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">Connection Status</p>
                                <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/20">Coming Soon</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Connect your WhatsApp Business number to enable automations
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="text-brand border-brand hover:bg-brand/5">
                            Connect
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
