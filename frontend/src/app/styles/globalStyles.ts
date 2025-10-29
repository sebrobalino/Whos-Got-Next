// app/styles/globalStyles.ts
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  rowItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  rowItemText: {
    color: "#111827",
    fontWeight: "600",
  },
  rowItemDanger: {
    borderColor: "#ef4444",
  },

  screenWrap: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topIcon: {
    position: "absolute",
    top: 12,
    right: 24,
    width: 72,
    height: 72,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  subtle: { color: "#6b7280" },
  gridWrap: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "flex-start",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  waitingNum: { fontSize: 40, fontWeight: "800", marginBottom: 4 },
  waitingLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  pillText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  joinBtn: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  joinText: { fontWeight: "800" },

  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: "#f97316", fontWeight: "600", marginLeft: 2 },

  statsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bigOrange: {
    fontSize: 48,
    fontWeight: "900",
    color: "#f97316",
    marginBottom: 4,
  },
  mediumGray: { color: "#4b5563", fontWeight: "500" },
  rowCenter: { flexDirection: "row", alignItems: "center" },

  panel: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
  },
  panelTitle: { fontWeight: "800", color: "#111827", marginBottom: 8 },

  footerButtons: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    backgroundColor: "#e5e7eb",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  ghostBtn: { alignItems: "center", paddingVertical: 16 },
  ghostBtnText: { color: "#6b7280", fontWeight: "600" },

  banner: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  bannerCourt: {
    color: "#fff",
    fontWeight: "600",
    opacity: 0.9,
    marginBottom: 6,
  },
  bannerPos: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
  },
  bannerEta: { color: "#fff", fontSize: 16 },

  progressTrack: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "35%",
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  soonCard: {
    backgroundColor: "#ecfdf5",
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  soonTitle: { color: "#047857", fontWeight: "800", fontSize: 16 },
  soonText: { color: "#059669", fontSize: 12 },

  leaveBtn: {
    borderWidth: 2,
    borderColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  leaveBtnText: { color: "#ef4444", fontWeight: "800" },

  emptyWrap: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  findBtn: {
    marginTop: 12,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  findBtnText: { color: "#fff", fontWeight: "800" },

  navBar: {
    borderTopWidth: 2,
    borderTopColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center", minWidth: 60, gap: 4 },
  navLabel: { fontSize: 11, fontWeight: "800", color: "#9ca3af" },
  navActive: { color: "#f97316" },
  navAvatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 96,
    height: 96,
    backgroundColor: "#f97316",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 16,
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 28 },
  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
});
