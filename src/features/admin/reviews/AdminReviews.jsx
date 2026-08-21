import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../../../lib/supabase";
import { useState } from "react";

function AdminReviews() {
  const queryClient = useQueryClient();

  // Get reviews
  async function getReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        user_id,
        product_id,
        products (
          id,
          title
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  // Query
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getReviews,
  });

  // Delete review
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) {
        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });
    },
  });

  const [deleteReviewId, setDeleteReviewId] = useState(null);

  // Loading
  if (isLoading) {
    return (
      <div className="lumora-reviews-loading">
        <div className="lumora-reviews-spinner" />
        <p>Loading reviews...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="lumora-reviews-error">
        <div className="lumora-reviews-error-icon">!</div>

        <h2>Unable to load reviews</h2>

        <p>{error.message}</p>
      </div>
    );
  }

  // Delete handler
  function handleDelete(reviewId) {
    setDeleteReviewId(reviewId);
  }

  async function confirmDelete() {
    if (!deleteReviewId) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(deleteReviewId);

      setDeleteReviewId(null);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  }

  return (
    <div className="lumora-reviews-page">
      {/* HEADER */}
      <div className="lumora-reviews-header">
        <div>
          <span className="lumora-reviews-eyebrow">CUSTOMER FEEDBACK</span>

          <h1>Reviews</h1>

          <p>Manage customer reviews and feedback about your products.</p>
        </div>

        <div className="lumora-reviews-count">
          <span>{reviews.length}</span>
          <small>Total Reviews</small>
        </div>
      </div>

      {/* EMPTY */}
      {reviews.length === 0 ? (
        <div className="lumora-reviews-empty">
          <div className="lumora-reviews-empty-icon">★</div>

          <h2>No reviews found</h2>

          <p>There are no customer reviews to display right now.</p>
        </div>
      ) : (
        <div className="lumora-reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="lumora-review-card">
              {/* CARD HEADER */}
              <div className="lumora-review-card-header">
                <div className="lumora-review-product">
                  <div className="lumora-review-product-icon">
                    {review.products?.title?.charAt(0)?.toUpperCase() || "P"}
                  </div>

                  <div>
                    <span className="lumora-review-product-label">PRODUCT</span>

                    <h2>{review.products?.title || "Unknown product"}</h2>
                  </div>
                </div>

                <div className="lumora-review-rating">
                  <span className="lumora-stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        key={index}
                        className={
                          index < Number(review.rating) ? "active" : ""
                        }
                      >
                        ★
                      </span>
                    ))}
                  </span>

                  <strong>{review.rating}/5</strong>
                </div>
              </div>

              {/* COMMENT */}
              <div className="lumora-review-comment">
                <span className="lumora-review-comment-label">
                  CUSTOMER COMMENT
                </span>

                <p>{review.comment || "No comment provided."}</p>
              </div>

              {/* FOOTER */}
              <div className="lumora-review-footer">
                <div className="lumora-review-meta">
                  <div className="lumora-review-meta-item">
                    <span className="lumora-review-meta-label">USER ID</span>

                    <span className="lumora-review-meta-value">
                      {review.user_id}
                    </span>
                  </div>

                  <div className="lumora-review-meta-item">
                    <span className="lumora-review-meta-label">CREATED</span>

                    <span className="lumora-review-meta-value">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  disabled={deleteReviewMutation.isPending}
                  className="lumora-review-delete"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteReviewId && (
        <div
          className="lumora-review-delete-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteReviewId(null);
            }
          }}
        >
          <div className="lumora-review-delete-modal">
            <div className="lumora-review-delete-icon">!</div>

            <h2>Delete Review?</h2>

            <p>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>

            <div className="lumora-review-delete-actions">
              <button
                type="button"
                onClick={() => setDeleteReviewId(null)}
                disabled={deleteReviewMutation.isPending}
                className="lumora-review-cancel"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteReviewMutation.isPending}
                className="lumora-review-confirm"
              >
                {deleteReviewMutation.isPending ? (
                  <>
                    <span className="lumora-review-delete-spinner" />
                    Deleting...
                  </>
                ) : (
                  "Delete Review"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`

        /* PAGE */

        .lumora-reviews-page {
          width: 100%;
          box-sizing: border-box;
          color: #30272A;
        }


        /* HEADER */

        .lumora-reviews-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .lumora-reviews-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #D85C70;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .lumora-reviews-header h1 {
          margin: 0;
          color: #30272A;
          font-size: 26px;
          font-weight: 700;
        }

        .lumora-reviews-header p {
          margin: 6px 0 0;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-reviews-count {
          min-width: 105px;
          padding: 13px 16px;
          border: 1px solid #F0DDE0;
          border-radius: 12px;
          background: #FFF9F7;
          text-align: center;
        }

        .lumora-reviews-count span {
          display: block;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-reviews-count small {
          color: #9A8F91;
          font-size: 9px;
        }


        /* LIST */

        .lumora-reviews-list {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }


        /* CARD */

        .lumora-review-card {
          padding: 18px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .035);
          transition: box-shadow .18s ease,
                      transform .18s ease;
        }

        .lumora-review-card:hover {
          box-shadow: 0 9px 28px rgba(48, 39, 42, .06);
          transform: translateY(-1px);
        }


        /* CARD HEADER */

        .lumora-review-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #F6EAEB;
        }

        .lumora-review-product {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .lumora-review-product-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid #F5D9DC;
          border-radius: 10px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 13px;
          font-weight: 700;
        }

        .lumora-review-product-label {
          display: block;
          margin-bottom: 3px;
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .lumora-review-product h2 {
          max-width: 400px;
          margin: 0;
          overflow: hidden;
          color: #403538;
          font-size: 12px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        /* RATING */

        .lumora-review-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border: 1px solid #F0DDE0;
          border-radius: 8px;
          background: #FFF9F7;
        }

        .lumora-stars {
          display: flex;
          gap: 1px;
          font-size: 13px;
          letter-spacing: 0;
        }

        .lumora-stars span {
          color: #E8D8DA;
        }

        .lumora-stars span.active {
          color: #D85C70;
        }

        .lumora-review-rating strong {
          color: #776B6D;
          font-size: 9px;
        }


        /* COMMENT */

        .lumora-review-comment {
          padding: 15px 0;
        }

        .lumora-review-comment-label {
          display: block;
          margin-bottom: 7px;
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .08em;
        }

        .lumora-review-comment p {
          margin: 0;
          color: #5F5355;
          font-size: 11px;
          line-height: 1.8;
        }


        /* FOOTER */

        .lumora-review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 13px;
          border-top: 1px solid #F6EAEB;
        }

        .lumora-review-meta {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .lumora-review-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lumora-review-meta-label {
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .06em;
        }

        .lumora-review-meta-value {
          max-width: 260px;
          overflow: hidden;
          color: #776B6D;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        /* DELETE BUTTON */

        .lumora-review-delete {
          min-height: 31px;
          padding: 0 11px;
          border: 1px solid #F3D9DD;
          border-radius: 7px;
          background: #FFF8F8;
          color: #C85A68;
          font-family: inherit;
          font-size: 9px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s ease;
        }

        .lumora-review-delete:hover:not(:disabled) {
          border-color: #E9AEB6;
          background: #FCE8EA;
          transform: translateY(-1px);
        }

        .lumora-review-delete:disabled {
          opacity: .5;
          cursor: not-allowed;
        }


        /* EMPTY */

        .lumora-reviews-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          padding: 30px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          text-align: center;
        }

        .lumora-reviews-empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border-radius: 17px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 24px;
        }

        .lumora-reviews-empty h2 {
          margin: 0;
          color: #4D4144;
          font-size: 16px;
        }

        .lumora-reviews-empty p {
          margin: 7px 0 0;
          color: #9A8F91;
          font-size: 11px;
        }


        /* LOADING */

        .lumora-reviews-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-reviews-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #F5C6CC;
          border-top-color: #D85C70;
          border-radius: 50%;
          animation: lumoraReviewsSpin .7s linear infinite;
        }


        /* ERROR */

        .lumora-reviews-error {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          text-align: center;
        }

        .lumora-reviews-error-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 14px;
          background: #FFF0EC;
          color: #D85C70;
          font-weight: 700;
        }

        .lumora-reviews-error h2 {
          margin: 0;
          color: #403538;
          font-size: 15px;
        }

        .lumora-reviews-error p {
          max-width: 500px;
          margin: 7px 0 0;
          color: #9A8F91;
          font-size: 11px;
        }


        /* DELETE MODAL */

        .lumora-review-delete-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(48, 39, 42, .48);
          backdrop-filter: blur(4px);
          animation: lumoraReviewOverlay .18s ease;
        }

        .lumora-review-delete-modal {
          width: min(390px, 100%);
          padding: 27px;
          border: 1px solid #F0DDE0;
          border-radius: 18px;
          background: #FFFFFF;
          box-shadow: 0 24px 70px rgba(48, 39, 42, .18);
          text-align: center;
          animation: lumoraReviewModal .2s ease;
        }

        .lumora-review-delete-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin: 0 auto 14px;
          border-radius: 15px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-review-delete-modal h2 {
          margin: 0;
          color: #30272A;
          font-size: 18px;
        }

        .lumora-review-delete-modal p {
          margin: 8px 0 21px;
          color: #9A8F91;
          font-size: 11px;
          line-height: 1.7;
        }

        .lumora-review-delete-actions {
          display: flex;
          justify-content: center;
          gap: 9px;
        }

        .lumora-review-cancel,
        .lumora-review-confirm {
          min-height: 40px;
          padding: 0 16px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s ease;
        }

        .lumora-review-cancel {
          border: 1px solid #F0DDE0;
          background: #FFFFFF;
          color: #776B6D;
        }

        .lumora-review-cancel:hover:not(:disabled) {
          border-color: #F5C6CC;
          background: #FFF0EC;
          color: #D85C70;
        }

        .lumora-review-confirm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-width: 125px;
          border: 0;
          background: #D85C70;
          color: #FFFFFF;
        }

        .lumora-review-confirm:hover:not(:disabled) {
          background: #B83F55;
          transform: translateY(-1px);
        }

        .lumora-review-confirm:disabled,
        .lumora-review-cancel:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .lumora-review-delete-spinner {
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255,255,255,.45);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: lumoraReviewsSpin .7s linear infinite;
        }


        /* ANIMATIONS */

        @keyframes lumoraReviewsSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes lumoraReviewOverlay {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes lumoraReviewModal {
          from {
            opacity: 0;
            transform: translateY(10px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }


        /* RESPONSIVE */

        @media (max-width: 700px) {

          .lumora-reviews-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-review-card-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-review-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-review-delete {
            width: 100%;
          }

          .lumora-review-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

        }

        @media (prefers-reduced-motion: reduce) {
          .lumora-reviews-spinner,
          .lumora-review-delete-spinner,
          .lumora-review-delete-overlay,
          .lumora-review-delete-modal {
            animation: none;
          }
        }

      `}</style>
    </div>
  );
}

export default AdminReviews;
