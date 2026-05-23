import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const BASE = import.meta.env.BASE_URL;

const router = createRouter({
  history: createWebHistory(BASE),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Auth/LoginView.vue"),
      meta: { guest: true },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/Auth/RegisterView.vue"),
      meta: { guest: true },
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: () => import("@/views/Auth/ForgotPasswordView.vue"),
      meta: { guest: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/Player/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/games",
      name: "GameLobby",
      component: () => import("@/views/Player/GameLobbyView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/Player/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/deposit",
      name: "Deposit",
      component: () => import("@/views/Finance/DepositView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/withdraw",
      name: "Withdraw",
      component: () => import("@/views/Finance/WithdrawView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/transactions",
      name: "Transactions",
      component: () => import("@/views/Finance/TransactionView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/bonuses",
      name: "Bonuses",
      component: () => import("@/views/Finance/BonusView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/affiliate",
      name: "Affiliate",
      component: () => import("@/views/Affiliate/AffiliateHubView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("@/views/Admin/AdminDashboard.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/deposits",
      name: "AdminDeposits",
      component: () => import("@/views/Admin/DepositApproval.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/withdrawals",
      name: "AdminWithdrawals",
      component: () => import("@/views/Admin/WithdrawApproval.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/users",
      name: "AdminUsers",
      component: () => import("@/views/Admin/UserManagement.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/games",
      name: "AdminGames",
      component: () => import("@/views/Admin/GameManagement.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/reports",
      name: "AdminReports",
      component: () => import("@/views/Admin/ReportView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/announcements",
      name: "AdminAnnouncements",
      component: () => import("@/views/Admin/AnnouncementsView.vue"),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();
  if (!auth.initialized) await auth.init();

  if (to.meta.requiresAuth && !auth.user) {
    return next({ name: "Login" });
  }
  if (to.meta.requiresAdmin && auth.profile?.role !== "admin") {
    return next({ name: "Dashboard" });
  }
  if (to.meta.guest && auth.user) {
    return next({ name: "Dashboard" });
  }
  next();
});

export default router;
