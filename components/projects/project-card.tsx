"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Link as LinkIcon, 
  Check,
  MoreHorizontal
} from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  intendedVibe: string;
  createdAt: Date | string;
  imageUrl?: string | null;
  score?: number | null;
  hasAnalysis: boolean;
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreBand(score: number) {
  if (score >= 80) return { label: "Strong alignment", variant: "success" as const };
  if (score >= 60) return { label: "Mostly aligned", variant: "default" as const };
  if (score >= 40) return { label: "Mixed signal", variant: "warn" as const };
  return { label: "Off-target", variant: "danger" as const };
}

export function ProjectCard({
  id,
  title: initialTitle,
  intendedVibe,
  createdAt,
  imageUrl,
  score,
  hasAnalysis,
}: ProjectCardProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { variant } = score !== null ? scoreBand(score) : { variant: "outline" };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if we didn't click an action
    if (!(e.target as HTMLElement).closest('.card-actions')) {
      router.push(`/projects/${id}`);
    }
  };

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    const newTitle = window.prompt("Enter new project title:", title);
    if (!newTitle || newTitle === title) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        setTitle(newTitle);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to rename:", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      setIsDeleting(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    setShowMenu(false);
  };

  if (isDeleting) return null;

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-raised transition-all hover:border-border-strong hover:shadow-xl cursor-pointer"
    >
      {/* 3-dot Menu Container */}
      <div className="absolute top-3 right-3 z-30 card-actions" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-base/80 text-text-secondary backdrop-blur-md transition-all hover:bg-bg-base hover:text-text-primary border border-border-subtle shadow-lg"
          aria-label="More actions"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-border-default bg-bg-base shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="py-1.5">
              <button
                onClick={handleRename}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors text-left"
              >
                <Pencil className="h-4 w-4" /> Rename
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors text-left"
              >
                <LinkIcon className="h-4 w-4" /> Share
              </button>
              <div className="h-px bg-border-subtle/50 my-1.5 mx-2" />
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger/80 hover:text-danger hover:bg-danger/10 transition-colors text-left"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-elevated/50 z-10">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">No preview</span>
          </div>
        )}
        
        {/* Visual overlay for score */}
        {hasAnalysis && typeof score === "number" && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-bg-base/90 backdrop-blur-md border border-border-subtle shadow-xl">
             <div 
               className="h-2 w-2 rounded-full animate-pulse" 
               style={{ backgroundColor: variant === "success" ? "#10b981" : variant === "warn" ? "#f59e0b" : variant === "danger" ? "#ef4444" : "#84cc16" }}
             />
             <span className="text-sm font-bold tabular-nums text-text-primary leading-none">{score}</span>
          </div>
        )}

        {isCopied && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-bg-base/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-xl">
              <Check className="h-3.5 w-3.5" />
              Link copied
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 z-20">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold tracking-tight text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
            {title}
          </h3>
          {hasAnalysis && typeof score === "number" ? (
            <Badge variant={scoreBand(score).variant} className="shrink-0 text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
              {scoreBand(score).label}
            </Badge>
          ) : (
            <Badge variant="outline" className="shrink-0 text-[10px] py-0 px-2 font-bold uppercase tracking-wider">Draft</Badge>
          )}
        </div>
        <p className="mt-2.5 text-[11px] text-text-tertiary line-clamp-2 leading-relaxed font-medium">
          {intendedVibe}
        </p>
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-border-subtle/30">
          <div className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold">
            {formatDate(createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
