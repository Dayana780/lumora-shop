import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";

function UserDetails() {
  const { id } = useParams();

  // Get user
  async function getUser(userId) {
    const { data, error } = await supabase.rpc("get_admin_user_details", {
      target_user_id: userId,
    });

    if (error) {
      throw error;
    }

    return data?.[0] ?? null;
  }

  // Get addresses
  async function getUserAddresses(userId) {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  // Get orders
  async function getUserOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        total_price,
        status,
        payment_status,
        tracking_code,
        created_at,
        address_id
        `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  // User query
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });

  // Addresses query
  const {
    data: addresses = [],
    isLoading: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ["admin-user-addresses", id],
    queryFn: () => getUserAddresses(id),
    enabled: !!id,
  });

  // Orders query
  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["admin-user-orders", id],
    queryFn: () => getUserOrders(id),
    enabled: !!id,
  });

  // Loading
  if (userLoading || addressesLoading || ordersLoading) {
    return (
      <div className="lumora-user-details-loading">
        <div className="lumora-user-details-spinner" />
        <p>Loading user details...</p>
      </div>
    );
  }

  // Error
  if (userError) {
    return (
      <div className="lumora-user-details-error">
        <div>!</div>
        <h2>Error loading user</h2>
        <p>{userError.message}</p>
      </div>
    );
  }

  if (addressesError) {
    return (
      <div className="lumora-user-details-error">
        <div>!</div>
        <h2>Error loading addresses</h2>
        <p>{addressesError.message}</p>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="lumora-user-details-error">
        <div>!</div>
        <h2>Error loading orders</h2>
        <p>{ordersError.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="lumora-user-details-empty">
        <div>♙</div>
        <h2>User not found</h2>
        <p>The requested user could not be found.</p>

        <Link to="/admin/users">Back to Users</Link>
      </div>
    );
  }

  const userName = user.full_name || "No name";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="lumora-user-details-page">
      {/* PAGE HEADER */}
      <div className="lumora-user-details-header">
        <div className="lumora-user-details-heading">
          <Link to="/admin/users" className="lumora-back-link">
            ← Back to Users
          </Link>

          <div className="lumora-user-details-title">
            <div className="lumora-user-details-avatar">{userInitial}</div>

            <div>
              <span>CUSTOMER PROFILE</span>

              <h1>{userName}</h1>

              <p>{user.email || "No email"}</p>
            </div>
          </div>
        </div>

        <div className="lumora-user-details-role">
          {user.role || "Customer"}
        </div>
      </div>

      {/* USER INFORMATION */}
      <section className="lumora-details-section">
        <div className="lumora-section-title">
          <div className="lumora-section-icon">♙</div>

          <div>
            <h2>User Information</h2>
            <p>Basic account information</p>
          </div>
        </div>

        <div className="lumora-info-grid">
          <div className="lumora-info-box">
            <span>ID</span>
            <strong>{user.id}</strong>
          </div>

          <div className="lumora-info-box">
            <span>EMAIL</span>
            <strong>{user.email || "Not provided"}</strong>
          </div>

          <div className="lumora-info-box">
            <span>FULL NAME</span>
            <strong>{user.full_name || "Not provided"}</strong>
          </div>

          <div className="lumora-info-box">
            <span>PHONE</span>
            <strong>{user.phone || "Not provided"}</strong>
          </div>

          <div className="lumora-info-box">
            <span>ROLE</span>
            <strong>{user.role || "Not specified"}</strong>
          </div>

          <div className="lumora-info-box">
            <span>CREATED AT</span>
            <strong>
              {user.created_at
                ? new Date(user.created_at).toLocaleString()
                : "Unknown"}
            </strong>
          </div>
        </div>
      </section>

      {/* ADDRESSES */}
      <section className="lumora-details-section">
        <div className="lumora-section-title">
          <div className="lumora-section-icon">⌂</div>

          <div>
            <h2>Addresses</h2>
            <p>Saved shipping addresses</p>
          </div>

          <span className="lumora-section-count">{addresses.length}</span>
        </div>

        {addresses.length === 0 ? (
          <div className="lumora-section-empty">No addresses found.</div>
        ) : (
          <div className="lumora-address-grid">
            {addresses.map((address) => (
              <div key={address.id} className="lumora-address-card">
                <div className="lumora-address-header">
                  <div className="lumora-address-icon">⌂</div>

                  {address.is_default && (
                    <span className="lumora-default-badge">Default</span>
                  )}
                </div>

                <div className="lumora-address-content">
                  <div>
                    <span>Name</span>
                    <strong>{address.full_name || "-"}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{address.phone || "-"}</strong>
                  </div>

                  <div>
                    <span>Province</span>
                    <strong>{address.province || "-"}</strong>
                  </div>

                  <div>
                    <span>City</span>
                    <strong>{address.city || "-"}</strong>
                  </div>

                  <div>
                    <span>Postal Code</span>
                    <strong>{address.postal_code || "-"}</strong>
                  </div>

                  <div className="lumora-address-full">
                    <span>Address</span>
                    <strong>{address.address || "-"}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ORDERS */}
      <section className="lumora-details-section">
        <div className="lumora-section-title">
          <div className="lumora-section-icon">#</div>

          <div>
            <h2>Orders</h2>
            <p>Customer order history</p>
          </div>

          <span className="lumora-section-count">{orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div className="lumora-section-empty">No orders found.</div>
        ) : (
          <div className="lumora-orders-list">
            {orders.map((order) => (
              <div key={order.id} className="lumora-order-card">
                <div className="lumora-order-main">
                  <div className="lumora-order-number">
                    <span>ORDER ID</span>
                    <strong>#{order.id}</strong>
                  </div>

                  <div className="lumora-order-price">
                    <span>TOTAL</span>
                    <strong>
                      {Number(order.total_price).toLocaleString()} تومان
                    </strong>
                  </div>
                </div>

                <div className="lumora-order-statuses">
                  <div
                    className={`lumora-status lumora-status-${order.status}`}
                  >
                    {order.status || "Unknown"}
                  </div>

                  <div
                    className={`lumora-payment-status lumora-payment-${order.payment_status}`}
                  >
                    {order.payment_status || "Unknown"}
                  </div>
                </div>

                <div className="lumora-order-meta">
                  <div>
                    <span>TRACKING CODE</span>
                    <strong>{order.tracking_code || "Not assigned"}</strong>
                  </div>

                  <div>
                    <span>CREATED</span>
                    <strong>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Unknown"}
                    </strong>
                  </div>
                </div>

                <Link
                  to={`/admin/orders/${order.id}`}
                  className="lumora-order-details-btn"
                >
                  View Order Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <style>{`

        .lumora-user-details-page {
          width: 100%;
          box-sizing: border-box;
          color: #30272A;
        }


        /* HEADER */

        .lumora-user-details-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .lumora-back-link {
          display: inline-block;
          margin-bottom: 13px;
          color: #C85A68;
          font-size: 10px;
          font-weight: 600;
          text-decoration: none;
        }

        .lumora-back-link:hover {
          color: #A83F50;
        }

        .lumora-user-details-title {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .lumora-user-details-avatar {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 15px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 18px;
          font-weight: 700;
        }

        .lumora-user-details-title span {
          display: block;
          margin-bottom: 4px;
          color: #D85C70;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
        }

        .lumora-user-details-title h1 {
          margin: 0;
          color: #30272A;
          font-size: 23px;
          font-weight: 700;
        }

        .lumora-user-details-title p {
          margin: 4px 0 0;
          color: #9A8F91;
          font-size: 10px;
        }

        .lumora-user-details-role {
          padding: 7px 12px;
          border: 1px solid #F0DDE0;
          border-radius: 8px;
          background: #FFF9F7;
          color: #C85A68;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }


        /* SECTIONS */

        .lumora-details-section {
          margin-bottom: 20px;
          padding: 18px;
          border: 1px solid #F0DDE0;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 5px 20px rgba(48, 39, 42, .035);
        }

        .lumora-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 17px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F6EAEB;
        }

        .lumora-section-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 9px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 14px;
          font-weight: 700;
        }

        .lumora-section-title h2 {
          margin: 0;
          color: #403538;
          font-size: 13px;
          font-weight: 700;
        }

        .lumora-section-title p {
          margin: 3px 0 0;
          color: #A69B9D;
          font-size: 9px;
        }

        .lumora-section-count {
          min-width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          margin-left: auto;
          border-radius: 7px;
          background: #FFF0EC;
          color: #C85A68;
          font-size: 9px;
          font-weight: 700;
        }


        /* USER INFO */

        .lumora-info-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .lumora-info-box {
          min-width: 0;
          padding: 12px;
          border: 1px solid #F5E8E9;
          border-radius: 9px;
          background: #FFFCFB;
        }

        .lumora-info-box span {
          display: block;
          margin-bottom: 5px;
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .05em;
        }

        .lumora-info-box strong {
          display: block;
          overflow: hidden;
          color: #64585A;
          font-size: 10px;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }


        /* ADDRESS */

        .lumora-address-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .lumora-address-card {
          padding: 14px;
          border: 1px solid #F4E5E7;
          border-radius: 11px;
          background: #FFFCFB;
        }

        .lumora-address-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .lumora-address-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #FFF0EC;
          color: #D85C70;
          font-size: 13px;
        }

        .lumora-default-badge {
          padding: 4px 7px;
          border-radius: 5px;
          background: #FBE9D8;
          color: #A56A3D;
          font-size: 8px;
          font-weight: 700;
        }

        .lumora-address-content {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .lumora-address-content > div {
          min-width: 0;
        }

        .lumora-address-content span {
          display: block;
          margin-bottom: 4px;
          color: #B1A6A8;
          font-size: 8px;
          font-weight: 600;
        }

        .lumora-address-content strong {
          display: block;
          color: #675B5D;
          font-size: 9px;
          font-weight: 500;
          line-height: 1.7;
        }

        .lumora-address-full {
          grid-column: 1 / -1;
        }


        /* ORDERS */

        .lumora-orders-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .lumora-order-card {
          display: grid;
          grid-template-columns: 1.3fr .7fr 1.2fr auto;
          align-items: center;
          gap: 15px;
          padding: 13px;
          border: 1px solid #F4E5E7;
          border-radius: 10px;
          background: #FFFCFB;
        }

        .lumora-order-main {
          min-width: 0;
        }

        .lumora-order-number span,
        .lumora-order-price span,
        .lumora-order-meta span {
          display: block;
          margin-bottom: 4px;
          color: #B1A6A8;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: .05em;
        }

        .lumora-order-number strong {
          display: block;
          overflow: hidden;
          color: #514548;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-order-price strong {
          display: block;
          color: #C85A68;
          font-size: 10px;
        }

        .lumora-order-statuses {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .lumora-status,
        .lumora-payment-status {
          padding: 5px 7px;
          border-radius: 5px;
          font-size: 7px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .lumora-status-pending {
          background: #FFF4D8;
          color: #A77A21;
        }

        .lumora-status-processing {
          background: #EAF0FF;
          color: #5872B0;
        }

        .lumora-status-shipped {
          background: #E9F3FF;
          color: #4777A8;
        }

        .lumora-status-delivered {
          background: #E7F5EC;
          color: #4A8B61;
        }

        .lumora-status-cancelled {
          background: #FCE8EA;
          color: #C85A68;
        }

        .lumora-payment-pending {
          background: #FFF4D8;
          color: #A77A21;
        }

        .lumora-payment-paid {
          background: #E7F5EC;
          color: #4A8B61;
        }

        .lumora-payment-failed {
          background: #FCE8EA;
          color: #C85A68;
        }

        .lumora-order-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .lumora-order-meta strong {
          display: block;
          overflow: hidden;
          color: #716568;
          font-size: 8px;
          font-weight: 500;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lumora-order-details-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 32px;
          padding: 0 10px;
          border: 1px solid #F0DDE0;
          border-radius: 7px;
          background: #FFF9F7;
          color: #C85A68;
          font-size: 8px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: .18s ease;
        }

        .lumora-order-details-btn:hover {
          border-color: #E8B4BC;
          background: #FFF0EC;
        }


        /* EMPTY */

        .lumora-section-empty {
          padding: 25px;
          border-radius: 9px;
          background: #FFFCFB;
          color: #9A8F91;
          font-size: 10px;
          text-align: center;
        }


        /* LOADING */

        .lumora-user-details-loading {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #9A8F91;
          font-size: 12px;
        }

        .lumora-user-details-spinner {
          width: 28px;
          height: 28px;
          border: 3px solid #F5C6CC;
          border-top-color: #D85C70;
          border-radius: 50%;
          animation: lumoraUserDetailsSpin .7s linear infinite;
        }


        /* ERROR */

        .lumora-user-details-error,
        .lumora-user-details-empty {
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

        .lumora-user-details-error > div,
        .lumora-user-details-empty > div {
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

        .lumora-user-details-error h2,
        .lumora-user-details-empty h2 {
          margin: 0;
          color: #403538;
          font-size: 16px;
        }

        .lumora-user-details-error p,
        .lumora-user-details-empty p {
          margin: 7px 0 15px;
          color: #9A8F91;
          font-size: 11px;
        }

        .lumora-user-details-empty a {
          padding: 8px 12px;
          border-radius: 7px;
          background: #D85C70;
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 600;
          text-decoration: none;
        }


        /* RESPONSIVE */

        @media (max-width: 950px) {

          .lumora-order-card {
            grid-template-columns: 1fr 1fr;
          }

          .lumora-order-details-btn {
            width: 100%;
          }

        }

        @media (max-width: 750px) {

          .lumora-user-details-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .lumora-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .lumora-address-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 550px) {

          .lumora-info-grid {
            grid-template-columns: 1fr;
          }

          .lumora-address-content {
            grid-template-columns: 1fr;
          }

          .lumora-address-full {
            grid-column: auto;
          }

          .lumora-order-card {
            grid-template-columns: 1fr;
          }

        }

        @keyframes lumoraUserDetailsSpin {
          to {
            transform: rotate(360deg);
          }
        }

      `}</style>
    </div>
  );
}

export default UserDetails;
