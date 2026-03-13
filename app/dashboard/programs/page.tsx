"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Copy, Edit2, Trash2, PauseCircle, PlayCircle, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Program {
    id: string;
    name: string;
    description?: string;
    duration_weeks: number;
    price: number;
    currency: string;
    checkin_type: string;
    is_active: boolean;
    created_at: string;
}

export default function ProgramsPage() {
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [copyDialogOpen, setCopyDialogOpen] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration_weeks: "12",
        price: "",
        currency: "INR",
        checkin_type: "fitness",
    });
    const [coachSlug, setCoachSlug] = useState<string>("");

    useEffect(() => {
        // Fetch coach slug for copy link functionality
        async function fetchCoachSlug() {
            try {
                const res = await fetch("/api/coaches/profile");
                if (res.ok) {
                    const data = await res.json();
                    setCoachSlug(data.slug || "");
                }
            } catch (error) {
                console.error("Error fetching coach slug:", error);
            }
        }
        fetchCoachSlug();
    }, []);

    useEffect(() => {
        fetchPrograms();
    }, []);

    async function fetchPrograms() {
        try {
            const res = await fetch("/api/programs");
            if (!res.ok) throw new Error("Failed to fetch programs");
            const data = await res.json();
            setPrograms(data);
        } catch (error) {
            console.error("Error fetching programs:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate() {
        try {
            const res = await fetch("/api/programs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    duration_weeks: parseInt(formData.duration_weeks),
                    price: parseFloat(formData.price),
                }),
            });

            if (!res.ok) throw new Error("Failed to create program");

            await fetchPrograms();
            setCreateDialogOpen(false);
            resetForm();
            showSuccess("Program created successfully!");
        } catch (error) {
            console.error("Error creating program:", error);
            showError("Failed to create program. Please try again.");
        }
    }

    async function handleUpdate() {
        if (!selectedProgram) return;

        try {
            const res = await fetch(`/api/programs/${selectedProgram.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    duration_weeks: parseInt(formData.duration_weeks),
                    price: parseFloat(formData.price),
                }),
            });

            if (!res.ok) throw new Error("Failed to update program");

            await fetchPrograms();
            setEditDialogOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error updating program:", error);
        }
    }

    async function handleToggleActive(program: Program) {
        try {
            const res = await fetch(`/api/programs/${program.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !program.is_active }),
            });

            if (!res.ok) throw new Error("Failed to update program");

            await fetchPrograms();
        } catch (error) {
            console.error("Error toggling program status:", error);
        }
    }

    async function handleDelete(program: Program) {
        if (!confirm(`Are you sure you want to delete "${program.name}"?`)) return;

        try {
            const res = await fetch(`/api/programs/${program.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete program");

            await fetchPrograms();
        } catch (error) {
            console.error("Error deleting program:", error);
        }
    }

    function openEditDialog(program: Program) {
        setSelectedProgram(program);
        setFormData({
            name: program.name,
            description: program.description || "",
            duration_weeks: String(program.duration_weeks),
            price: String(program.price),
            currency: program.currency,
            checkin_type: program.checkin_type,
        });
        setEditDialogOpen(true);
    }

    function openCopyDialog(program: Program) {
        setSelectedProgram(program);
        setCopyDialogOpen(true);
    }

    function resetForm() {
        setFormData({
            name: "",
            description: "",
            duration_weeks: "12",
            price: "",
            currency: "INR",
            checkin_type: "fitness",
        });
        setSelectedProgram(null);
    }

    function copyToIntakeLink(programId: string) {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const link = coachSlug 
            ? `${baseUrl}/join/${coachSlug}?program=${programId}`
            : `${baseUrl}/join/[slug]?program=${programId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-display uppercase">Programs</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your coaching programs and pricing
                    </p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-brand hover:bg-brand/90 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                </Button>
            </div>

            {/* Programs Grid */}
            {programs.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No programs yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first coaching program to start enrolling clients
                        </p>
                        <Button
                            onClick={() => setCreateDialogOpen(true)}
                            className="bg-brand hover:bg-brand/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Program
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <Card key={program.id} className="relative overflow-hidden">
                            {program.is_active && (
                                <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
                            )}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold font-display uppercase">
                                            {program.name}
                                        </h3>
                                        <Badge
                                            variant={program.is_active ? "default" : "secondary"}
                                            className="mt-2"
                                        >
                                            {program.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {program.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {program.description}
                                    </p>
                                )}

                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold font-display text-brand">
                                        ₹{program.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        / {program.duration_weeks} weeks
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="capitalize">{program.checkin_type}</span>
                                    <span>•</span>
                                    <span>{program.currency}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openCopyDialog(program)}
                                        className="flex-1"
                                    >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Copy Link
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openEditDialog(program)}
                                    >
                                        <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleToggleActive(program)}
                                    >
                                        {program.is_active ? (
                                            <PauseCircle className="h-3 w-3" />
                                        ) : (
                                            <PlayCircle className="h-3 w-3" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(program)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Program</DialogTitle>
                        <DialogDescription>
                            Set up a new coaching program for your clients
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Program Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="e.g., 12-Week Weight Loss Program"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Brief description of what's included..."
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (weeks) *</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={formData.duration_weeks}
                                    onChange={(e) =>
                                        setFormData({ ...formData, duration_weeks: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    placeholder="2999"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, currency: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">₹ INR</SelectItem>
                                        <SelectItem value="USD">$ USD</SelectItem>
                                        <SelectItem value="GBP">£ GBP</SelectItem>
                                        <SelectItem value="CAD">$ CAD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="checkin_type">Check-in Type</Label>
                                <Select
                                    value={formData.checkin_type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, checkin_type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fitness">Fitness</SelectItem>
                                        <SelectItem value="yoga">Yoga</SelectItem>
                                        <SelectItem value="wellness">Wellness</SelectItem>
                                        <SelectItem value="nutrition">Nutrition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCreateDialogOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-brand hover:bg-brand/90"
                            disabled={!formData.name || !formData.price}
                        >
                            Create Program
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Program</DialogTitle>
                        <DialogDescription>
                            Update program details and pricing
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Program Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-duration">Duration (weeks) *</Label>
                                <Input
                                    id="edit-duration"
                                    type="number"
                                    min="1"
                                    max="52"
                                    value={formData.duration_weeks}
                                    onChange={(e) =>
                                        setFormData({ ...formData, duration_weeks: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (₹) *</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-currency">Currency</Label>
                                <Select
                                    value={formData.currency}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, currency: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="INR">₹ INR</SelectItem>
                                        <SelectItem value="USD">$ USD</SelectItem>
                                        <SelectItem value="GBP">£ GBP</SelectItem>
                                        <SelectItem value="CAD">$ CAD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-checkin_type">Check-in Type</Label>
                                <Select
                                    value={formData.checkin_type}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, checkin_type: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fitness">Fitness</SelectItem>
                                        <SelectItem value="yoga">Yoga</SelectItem>
                                        <SelectItem value="wellness">Wellness</SelectItem>
                                        <SelectItem value="nutrition">Nutrition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditDialogOpen(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            className="bg-brand hover:bg-brand/90"
                            disabled={!formData.name || !formData.price}
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Copy Link Dialog */}
            <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Copy Intake Link</DialogTitle>
                        <DialogDescription>
                            Share this link with clients to enroll them in this program
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex gap-2">
                            <Input
                                value={coachSlug 
                                    ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${coachSlug}?program=${selectedProgram?.id}`
                                    : "Loading..."
                                }
                                readOnly
                            />
                            <Button
                                onClick={() => {
                                    if (selectedProgram) {
                                        copyToIntakeLink(selectedProgram.id);
                                        showSuccess("Intake link copied to clipboard!");
                                    }
                                }}
                                variant="outline"
                                disabled={!coachSlug}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                        {!coachSlug && (
                            <p className="text-sm text-muted-foreground mt-4">
                                Loading your coach slug...
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setCopyDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
