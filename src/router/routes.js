const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/auth/LoginPage.vue") },
    ],
  },
  {
    path: "/admin",
    component: () => import("layouts/Dashboard.vue"),
    children: [
      {
        path: "/admin/courses",
        component: () => import("src/pages/dashboard/CoursesPage.vue"),
        name: "admin.courses",
      },

      {
        path: "/admin/groups",
        component: () => import("src/pages/dashboard/GroupsPage.vue"),
        name: "admin.groups",
      },

      {
        path: "/user/overview",
        component: () => import("src/pages/dashboard/OverviewPage.vue"),
        name: "user.overview",
      },

      {
        path: "/admin/users",
        component: () => import("src/pages/dashboard/UsersPage.vue"),
        name: "admin.users",
      },
      {
        path: "/user/my-courses",
        component: () => import("src/pages/dashboard/MyCourses.vue"),
        name: "user.courses",
      },
      {
        path: "/user/enrollments",
        component: () => import("src/pages/dashboard/AllEnrollments.vue"),
        name: "enrollments",
      },
      // {
      //   path: "/admin/usertypes",
      //   component: () => import("pages/dashboard/UserTypes.vue"),
      //   name: "admin.usertypes",
      // },
      {
        path: "/user/enrollment",
        component: () => import("pages/dashboard/NewEnrollment.vue"),
        name: "new.enrollment",
      },
      {
        path: "/admin/ManageCourses",
        component: () => import("pages/dashboard/ManageCourses.vue"),
        name: "admin.ManageCourses",
      },
      {
        path: "/user/enroll",
        component: () => import("pages/EnrollCourses.vue"),
        name: "user.enroll",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/login",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "login",
  },
  {
    path: "/logout",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "logout",
  },
  {
    path: "/verify",
    component: () => import("pages/VerifyPage.vue"),
    name: "verify",
  },
  {
    path: "/register",
    component: () => import("pages/auth/RegisterPage.vue"),
    name: "register",
  },
];

export default routes;
