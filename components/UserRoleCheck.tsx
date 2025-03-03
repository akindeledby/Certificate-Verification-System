// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";

// const UserRoleCheck = () => {
//   const { user, isSignedIn } = useUser();
//   const router = useRouter();
//   const redirected = useRef(false); // Prevents multiple redirects
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isSignedIn || !user?.id || redirected.current) {
//       if (!isSignedIn) alert("You need to sign in first!");
//       setLoading(false);
//       return;
//     }

//     const checkUserRole = async () => {
//       try {
//         const res = await fetch("/api/getUserRole", {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         const data = await res.json();

//         if (res.ok && data.role) {
//           redirected.current = true; // Mark redirect as done
// if (data.role === "ADMIN") {
//   router.replace(`/admin/${user.id}/create_upload_certificate`);
// } else if (data.role === "INSTITUTE") {
//   router.replace(`/institute/${user.id}/create_upload_certificate`);
// } else {
//   alert("You are not allowed to access this page.");
// }
//         } else {
//           alert(data.error || "Access Denied!");
//         }
//       } catch (error) {
//         console.error("Failed to fetch user role:", error);
//         alert("An error occurred. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserRole();
//   }, [isSignedIn, user, router]);

//   if (loading) return <p>Loading...</p>;
//   return null; // This component only handles redirection
// };

// export default UserRoleCheck;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface UserRoleCheckProps {
  buttonText?: string; // Allows custom button text
  className?: string; // Allows custom styles
}

const UserRoleCheck: React.FC<UserRoleCheckProps> = ({
  buttonText = "Check Role", // Default text
  className = "bg-blue-600 text-white px-4 py-2 rounded", // Default styles
}) => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const checkUserRole = async () => {
    if (!isSignedIn) {
      alert("You need to sign in first!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/getUserRole");
      const data = await res.json();

      if (res.ok && data.role) {
        if (data.role === "ADMIN") {
          router.replace(`/admin/${user.id}/create_upload_certificate`);
        } else if (data.role === "INSTITUTE") {
          router.replace(`/institute/${user.id}/create_upload_certificate`);
        } else {
          alert("You are not allowed to access this page.");
        }
      } else {
        alert(data.error || "Access Denied!");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={checkUserRole}
      className={`${className} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
    >
      {loading ? "Checking..." : buttonText}
    </button>
  );
};

export default UserRoleCheck;
