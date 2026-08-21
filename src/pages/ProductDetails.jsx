import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useProducts } from "../context/ProductContext";

import { supabase } from "../lib/supabase";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { toast } from "sonner";
// Get product reviews

async function getProductReviews(productId) {
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      user_id
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    throw reviewsError;
  }

  if (!reviews || reviews.length === 0) {
    return [];
  }

  const userIds = [...new Set(reviews.map((review) => review.user_id))];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", userIds);

  if (profilesError) {
    throw profilesError;
  }

  const profileMap = Object.fromEntries(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return reviews.map((review) => ({
    ...review,
    profile: profileMap[review.user_id] ?? null,
  }));
}

// Product details

function ProductDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: () => getProductReviews(id),
  });
  const { productList, loading } = useProducts();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToCart } = useCart();

  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const product = productList.find((product) => product.id === id);
  async function handleSubmitReview(e) {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) {
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        toast("Please login first.");
        return;
      }

      // Insert review

      const { data: newReview, error } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          product_id: product.id,
          rating,
          comment: comment.trim(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh reviews

      await queryClient.invalidateQueries({
        queryKey: ["product-reviews", id],
      });

      // Reset form

      setRating(5);
      setComment("");

      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Submit review error:", error);

      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">Product Not Found</h1>
      </div>
    );
  }
  if (reviewsLoading) {
    return <Loading />;
  }

  if (reviewsError) {
    return <ErrorMessage message={reviewsError.message} />;
  }
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-3xl bg-blush-50">
          {product.product_images?.[0]?.image_url ? (
            <img
              src={product.product_images[0].image_url}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-500">
              No image
            </div>
          )}
        </div>

        <div>
          {product.categories?.name && (
            <p className="section-eyebrow">{product.categories.name}</p>
          )}
          <h1 className="mt-2 text-3xl font-semibold">{product.title}</h1>
          <p className="mt-3 text-2xl text-rose-600">
            ${Number(product.price).toLocaleString()}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-stone-500">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => addToCart(product)} className="btn-primary">
              <ShoppingBag size={16} />
              Add to Cart
            </button>

            {isInWishlist ? (
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="btn-secondary"
              >
                <Heart
                  size={16}
                  className="text-rose-500"
                  fill="currentColor"
                />
                Remove from Wishlist
              </button>
            ) : (
              <button
                onClick={() => addToWishlist(product)}
                className="btn-secondary"
              >
                <Heart size={16} />
                Add to Wishlist
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Write a Review</h2>

          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            <div>
              <label className="label-field">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="input-field w-32"
              >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </div>

            <div>
              <label className="label-field">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on this product..."
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">No reviews yet.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="card-surface p-4">
                  <div className="flex items-center gap-3">
                    {review.profile?.avatar_url ? (
                      <img
                        src={review.profile.avatar_url}
                        alt={review.profile.full_name || "User"}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-blush-100" />
                    )}

                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {review.profile?.full_name || "Anonymous User"}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className="fill-rose-400 text-rose-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-stone-500">
                    {review.comment}
                  </p>

                  <small className="mt-2 block text-xs text-stone-500/70">
                    {new Date(review.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
