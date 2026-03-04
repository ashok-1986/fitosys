"use client";

import { useState } from "react";
import {
    Plus,
    Copy,
    Check,
    Package,
    ToggleLeft,
    ToggleRight,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useApiData, apiMutate } from "@/lib/hooks";

interface ProgramData {
    id: string;
    coach_id: string;
    name: string;
    description: string | null;
    duration_weeks: number;
    price: number;
    currency: string;
    checkin_type: string;
    is_active: boolean;
    created_at: string;
}

interface CoachProfile {
    slug: string;
}

export default function ProgramsPage() {
    const { data: programsData, loading, refetch } = useApiData<ProgramData[]>("/api/programs");
    const { data: coach } = useApiData<CoachProfile>("/api/coaches/profile");
    const programs = programsData || [];

    const [copied, setCopied] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProgram, setNewProgram] = useState({
        name: "",
        duration_weeks: "8",
        price: "",
        currency: "INR",
        checkin_type: "fitness",
        description: "",
    });

    const onboardingLink = `fitosys.com/join/${coach?.slug || "..."}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://${onboardingLink}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleProgram = async (id: string, currentActive: boolean) => {
        await apiMutate(`/api/programs/${id}`, "PUT", { is_active: !currentActive });
        refetch();
    };

    const handleAddProgram = async () => {
        await apiMutate("/api/programs", "POST", {
            name: newProgram.name,
            duration_weeks: parseInt(newProgram.duration_weeks),
            price: parseFloat(newProgram.price),
            currency: newProgram.currency,
            checkin_type: newProgram.checkin_type,
            description: newProgram.description || null,
        });
        setNewProgram({ name: "", duration_weeks: "8", price: "", currency: "INR", checkin_type: "fitness", description: "" });
        setDialogOpen(false);
        refetch();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Programs</h1>
                    <p className="text-sm text-muted-foreground">
                        {programs.filter((p) => p.is_active).length} active programs
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand hover:bg-brand/90 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            New Program
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Program</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label>Program Name</Label>
                                <Input
                                    placeholder="e.g., 8-Week Fitness Kickstart"
                                    value={newProgram.name}
                                    onChange={(e) =>
                                        setNewProgram({ ...newProgram, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Select
                                        value={newProgram.duration_weeks}
                                        onValueChange={(v) =>
                                            setNewProgram({ ...newProgram, duration_weeks: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="4">4 weeks</SelectItem>
                                            <SelectItem value="8">8 weeks</SelectItem>
                                            <SelectItem value="12">12 weeks</SelectItem>
                                            <SelectItem value="16">16 weeks</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Check-in Type</Label>
                                    <Select
                                        value={newProgram.checkin_type}
                                        onValueChange={(v) =>
                                            setNewProgram({ ...newProgram, checkin_type: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fitness">Fitness</SelectItem>
                                            <SelectItem value="yoga">Yoga</SelectItem>
                                            <SelectItem value="wellness">Wellness</SelectItem>
                                            <SelectItem value="custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        placeholder="9999"
                                        value={newProgram.price}
                                        onChange={(e) =>
                                            setNewProgram({ ...newProgram, price: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select
                                        value={newProgram.currency}
                                        onValueChange={(v) =>
                                            setNewProgram({ ...newProgram, currency: v })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">₹ INR</SelectItem>
                                            <SelectItem value="GBP">£ GBP</SelectItem>
                                            <SelectItem value="USD">$ USD</SelectItem>
                                            <SelectItem value="CAD">C$ CAD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description (optional)</Label>
                                <Textarea
                                    placeholder="A short description for clients..."
                                    value={newProgram.description}
                                    onChange={(e) =>
                                        setNewProgram({
                                            ...newProgram,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={handleAddProgram}
                                disabled={!newProgram.name || !newProgram.price}
                                className="w-full bg-brand hover:bg-brand/90 text-white"
                            >
                                Create Program
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Onboarding Link */}
            <Card className="border-brand/20 bg-brand/5">
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium">Your Client Onboarding Link</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Share this with new clients to onboard them instantly
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="px-3 py-1.5 bg-card rounded-md text-sm border">
                                {onboardingLink}
                            </code>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-success" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                            <a href={`/join/${coach?.slug || ""}`} target="_blank">
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Program Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {programs.map((program) => (
                    <Card
                        key={program.id}
                        className={`relative overflow-hidden transition-all ${!program.is_active ? "opacity-60" : ""}`}
                    >
                        <div
                            className={`absolute top-0 left-0 w-full h-1 ${program.is_active ? "bg-brand" : "bg-muted-foreground/30"}`}
                        />
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-base">{program.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1 text-xs">
                                        {program.checkin_type}
                                    </Badge>
                                </div>
                                <button onClick={() => toggleProgram(program.id, program.is_active)}>
                                    {program.is_active ? (
                                        <ToggleRight className="h-6 w-6 text-success" />
                                    ) : (
                                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold">
                                    {program.currency === "INR"
                                        ? "₹"
                                        : program.currency === "GBP"
                                            ? "£"
                                            : "$"}
                                    {program.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    / {program.duration_weeks} weeks
                                </span>
                            </div>
                            {program.description && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                    {program.description}
                                </p>
                            )}
                            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                <Package className="h-3 w-3" />
                                {program.is_active ? "Visible to clients" : "Hidden"}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
