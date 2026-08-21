import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { Link } from "react-router-dom";

async function getAdminUsers() {
  const { data, error } = await supabase.rpc("get_admin_users");

  if (error) {
    throw error;
  }

  return data ?? [];
}

function AdminUsers() {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });

  if (isLoading) {
    return (
      <div className="lumora-users-loading">
        <div className="lumora-users-spinner" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lumora-users-error">
        <div className="lumora-users-error-icon">!</div>

        <h2>Unable to load users</h2>

        <p>{error.message}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="lumora-users-empty">
        <div className="lumora-users-empty-icon">♙</div>

        <h2>No users found</h2>

        <p>There are no registered users to display.</p>
      </div>
    );
  }

  return (
    <div className="lumora-users-page">
      {/* HEADER */}
      <div className="lumora-users-header">
        <div>
          <span className="lumora-users-eyebrow">CUSTOMER MANAGEMENT</span>

          <h1>Users</h1>

          <p>Manage registered customers and view their account information.</p>
        </div>

        <div className="lumora-users-count">
          <span>{users.length}</span>
          <small>Total Users</small>
        </div>
      </div>

      {/* USERS */}
      <div className="lumora-users-grid">
        {users.map((user) => {
          const displayName = user.full_name || "No name";

          const initial = displayName.charAt(0).toUpperCase();

          return (
            <div key={user.id} className="lumora-user-card">
              {/* TOP */}
              <div className="lumora-user-card-top">
                <div className="lumora-user-avatar">{initial}</div>

                <div className="lumora-user-main">
                  <h2>{displayName}</h2>

                  <span className="lumora-user-role">
                    {user.role || "Customer"}
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="lumora-user-info">
                <div className="lumora-user-info-row">
                  <span className="lumora-user-info-label">EMAIL</span>

                  <span className="lumora-user-info-value">
                    {user.email || "No email"}
                  </span>
                </div>

                <div className="lumora-user-info-row">
                  <span className="lumora-user-info-label">PHONE</span>

                  <span className="lumora-user-info-value">
                    {user.phone || "No phone"}
                  </span>
                </div>
              </div>

              {/* ACTION */}
              <Link
                to={`/admin/users/${user.id}`}
                className="lumora-user-details-btn"
              >
                <span>View Details</span>
                <span className="lumora-user-arrow">→</span>
              </Link>
            </div>
          );
        })}
      </div>

      <style>{`
        .lumora-users-page {
          width: 100%;
          box-sizing: border-box;
          color: #30272A;
        }

        .lumora-users-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .lumora-users-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #D85C70;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .lumora-users-header h1 {
          margin: 0;
          color: #30272A;
          font-size: 26px;
          font-weight: 700;
        }

        .lumora-users-header p {
          margin: 6px 0 0;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-users-count {
          min-width: 105px;
          padding: 13px 16px;
          border: 1px solid #F0DDE0;
          border-radius: 12px;
          background: #FFF9F7;
          text-align: center;
        }

        .lumora-users-count span {
          display: block;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-users-count small {
          color: #9A8F91;
          font-size: 9px;
        }

        .lumora-users-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .lumora-user-card {
          padding: 18px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .035);
          transition: .18s ease;
        }

        .lumora-user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(48, 39, 42, .07);
        }

        .lumora-user-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 15px;
          border-bottom: 1px solid #F6EAEB;
        }

        .lumora-user-avatar {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 12px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 15px;
          font-weight: 700;
        }

        .lumora-user-main {
          min-width: 0;
        }

        .lumora-user-main h2 {
          margin: 0 0 4px;
          overflow: hidden;
          color: #403538;
          font-size: 13px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-user-role {
          display: inline-block;
          padding: 3px 7px;
          border-radius: 5px;
          background: #FFF0EC;
          color: #C85A68;
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .lumora-user-info {
          padding: 14px 0;
        }

        .lumora-user-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 6px 0;
        }

        .lumora-user-info-label {
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .07em;
        }

        .lumora-user-info-value {
          max-width: 65%;
          overflow: hidden;
          color: #776B6D;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-user-details-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 36px;
          box-sizing: border-box;
          padding: 0 12px;
          border: 1px solid #F0DDE0;
          border-radius: 8px;
          background: #FFF9F7;
          color: #C85A68;
          font-size: 9px;
          font-weight: 600;
          text-decoration: none;
          transition: .18s ease;
        }

        .lumora-user-details-btn:hover {
          border-color: #E8B4BC;
          background: #FFF0EC;
        }

        .lumora-user-arrow {
          font-size: 13px;
        }

        .lumora-users-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-users-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #F5C6CC;
          border-top-color: #D85C70;
          border-radius: 50%;
          animation: lumoraUsersSpin .7s linear infinite;
        }

        .lumora-users-error,
        .lumora-users-empty {
          min-height: 270px;
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

        .lumora-users-error-icon,
        .lumora-users-empty-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 15px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 20px;
          font-weight: 700;
        }

        .lumora-users-error h2,
        .lumora-users-empty h2 {
          margin: 0;
          color: #403538;
          font-size: 16px;
        }

        .lumora-users-error p,
        .lumora-users-empty p {
          margin: 7px 0 0;
          color: #9A8F91;
          font-size: 11px;
        }

        @keyframes lumoraUsersSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 750px) {
          .lumora-users-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-users-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminUsers;
