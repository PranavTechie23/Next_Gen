import React, { useEffect, useState } from "react";

import { useLocation } from "wouter";

import { Loader2 } from "lucide-react";

import {

  dashboardPathForRole,

  fetchAuthSession,

  normalizeRole,

  setSessionRole,

} from "@/lib/authSession";



type ProtectedRouteProps = {

  children: React.ReactNode;

  /** When set, only these roles may access the route. Others are redirected to their dashboard. */

  allowedRoles?: string[];

};



export default function ProtectedRoute({

  children,

  allowedRoles,

}: ProtectedRouteProps) {

  const [, navigate] = useLocation();

  const [status, setStatus] = useState<"checking" | "allowed" | "denied">("checking");



  useEffect(() => {

    let cancelled = false;



    (async () => {

      try {

        const session = await fetchAuthSession();

        if (cancelled) return;



        if (!session.authenticated || !session.user) {

          setStatus("denied");

          navigate("/login");

          return;

        }



        const role = normalizeRole(session.user.role);

        setSessionRole(role);



        if (allowedRoles?.length) {

          const allowed = allowedRoles.map((r) => normalizeRole(r));

          if (!allowed.includes(role)) {

            setStatus("denied");

            navigate(dashboardPathForRole(role));

            return;

          }

        }



        setStatus("allowed");

      } catch {

        if (!cancelled) {

          setStatus("denied");

          navigate("/login");

        }

      }

    })();



    return () => {

      cancelled = true;

    };

  }, [navigate, allowedRoles]);



  if (status === "checking" || status === "denied") {

    return (

      <div className="flex min-h-[40vh] items-center justify-center">

        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading" />

      </div>

    );

  }



  return <>{children}</>;

}

