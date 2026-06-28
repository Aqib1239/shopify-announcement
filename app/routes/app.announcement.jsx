import { useEffect, useState } from "react";
import {
  createAnnouncement,
  getAnnouncements,
} from "../services/announcementApi";

export default function AnnouncementManager() {
  const [announcement, setAnnouncement] = useState("");
  const [history, setHistory] = useState([]);

  const loadAnnouncements = async () => {
    try {
      const res = await getAnnouncements();

      if (res.success) {
        setHistory(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async () => {
    if (!announcement.trim()) {
      alert("Announcement is required");
      return;
    }
    try {
      const res = await fetch("/app/sync-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: announcement,
        }),
      });
  
      const data = await res.json();
  
      console.log("Response:", data);
  
      if (res.ok && data.success) {
        alert("Announcement Saved Successfully");
  
        setAnnouncement("");
  
        // Reload announcement history from MongoDB
        await loadAnnouncements();
      } else {
        alert(data.message || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <s-page heading="Announcement Manager">
      <s-section heading="Create Announcement">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "640px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              htmlFor="announcement"
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: "#1a1a1a",
                letterSpacing: "0.3px",
              }}
            >
              Announcement Text
            </label>

            <textarea
              id="announcement"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              rows={4}
              style={{
                padding: "14px 16px",
                fontSize: "15px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                resize: "vertical",
                fontFamily: "inherit",
                backgroundColor: "#fafafa",
              }}
              placeholder="Type your announcement here..."
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              background: "#008060",
              color: "white",
              padding: "12px 28px",
              borderRadius: "8px",
              cursor: "pointer",
              width: "fit-content",
              border: "none",
              fontWeight: "600",
              fontSize: "15px",
            }}
          >
            + Save Announcement
          </button>
        </div>
      </s-section>

      <div style={{ marginTop: "32px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "20px",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "12px",
          }}
        >
          Announcement History
          <span
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#6b7280",
              marginLeft: "12px",
            }}
          >
            ({history.length})
          </span>
        </h3>

        {history.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              border: "2px dashed #e5e7eb",
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            <span
              style={{
                fontSize: "40px",
                display: "block",
                marginBottom: "12px",
              }}
            >
              📢
            </span>
            No announcements found. Create your first one above!
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {history.map((item) => (
              <div
                key={item._id}
                style={{
                  border: "1px solid #e5e7eb",
                  padding: "16px 20px",
                  borderRadius: "10px",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.5",
                      color: "#1a1a1a",
                    }}
                  >
                    {item.text}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>🕐</span>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </s-page>
  );
}
