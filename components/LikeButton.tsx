"use client";

import { useState, useEffect, useCallback } from "react";

interface LikeButtonProps {
  slug: string;
}

/**
 * Bouton de "like" anonyme pour les articles.
 * Stocke le like dans localStorage pour éviter les doubles likes,
 * et synchronise le compteur avec l'API /api/likes.
 */
export default function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà liké
    const liked = localStorage.getItem(`liked:${slug}`);
    if (liked) setHasLiked(true);

    // Récupérer le compteur actuel
    fetch(`/api/likes?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setLikes(data.likes ?? 0))
      .catch(() => {});
  }, [slug]);

  const handleLike = useCallback(async () => {
    if (hasLiked) return;

    setHasLiked(true);
    setAnimate(true);
    setLikes((prev) => prev + 1);
    localStorage.setItem(`liked:${slug}`, "1");

    setTimeout(() => setAnimate(false), 600);

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.likes != null) setLikes(data.likes);
    } catch {
      // Compteur local suffit en cas d'erreur réseau
    }
  }, [slug, hasLiked]);

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked}
      aria-label={
        hasLiked ? `Vous avez aimé cet article (${likes})` : `Aimer cet article (${likes})`
      }
      className={`like-btn ${hasLiked ? "like-btn--liked" : ""} ${animate ? "like-btn--animate" : ""}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={hasLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="font-mono text-[0.6875rem] tabular-nums">{likes}</span>
    </button>
  );
}
