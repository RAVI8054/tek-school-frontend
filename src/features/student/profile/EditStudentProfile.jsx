import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Camera } from "lucide-react";
import { getStudentProfile, updateStudentProfile, uploadStudentAvatar } from "../../../lib/api";
import { pushToast } from "../../../lib/action-bus";
import { useHydrated } from "../../../lib/auth";

export default function EditStudentProfile() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cohort: "",
    track: "",
    location: "",
    bio: "",
    profile_img: ""
  });

  useEffect(() => {
    if (!hydrated) return;
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        if (res.data?.profile) {
          setForm({
            name: res.data.profile.name || "",
            email: res.data.profile.email || "",
            phone: res.data.profile.phone || "",
            cohort: res.data.profile.cohort || "",
            track: res.data.profile.track || "",
            location: res.data.profile.location || "",
            bio: res.data.profile.bio || "",
            profile_img: res.data.profile.profile_img || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        pushToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [hydrated]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudentProfile({
        name: form.name,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
      });
      window.dispatchEvent(new Event("profile_updated"));
      pushToast("Profile updated successfully");
      navigate("/dashboard/profile");
    } catch (err) {
      console.error(err);
      pushToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadStudentAvatar(file);
      if (res.data?.avatarUrl) {
        setForm((prev) => ({ ...prev, profile_img: res.data.avatarUrl }));
        window.dispatchEvent(new Event("profile_updated"));
        pushToast("Profile picture updated");
      }
    } catch (err) {
      console.error(err);
      pushToast(err.message || "Failed to upload profile picture", "error");
    } finally {
      setUploading(false);
    }
  };

  const field = (key, label, type = "text", disabled = false) => (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        disabled={disabled}
        className={`mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition-colors focus:border-[var(--accent-blue-deep)] ${
          disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white"
        }`}
      />
    </label>
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-blue-deep)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </button>

      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Edit Profile</h1>
        <p className="mt-1 text-slate-500">Update your public profile and personal details.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center gap-5">
            <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 font-display text-2xl font-bold text-slate-400 ring-4 ring-slate-50">
              {form.profile_img ? (
                <img src={form.profile_img} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                form.name ? form.name.charAt(0).toUpperCase() : "S"
              )}
              {uploading && (
                <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-blue-deep)]" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">Profile picture</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">PNG, JPG up to 5MB</p>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300">
                <Camera className="h-3.5 w-3.5" />
                {uploading ? "Uploading..." : "Change picture"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="my-2 border-t border-slate-100" />

          {/* Form Fields */}
          <div className="grid gap-5 sm:grid-cols-2">
            {field("name", "Full name")}
            {field("email", "Email", "email", true)}
            {field("phone", "Phone number")}
            {field("track", "Program", "text", true)}
            {field("cohort", "Cohort", "text", true)}
            <div className="sm:col-span-1">
              {field("location", "Location (City)")}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</span>
            <textarea
              rows={4}
              value={form.bio || ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us a bit about yourself..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition-colors focus:border-[var(--accent-blue-deep)] resize-none"
            />
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-blue-deep)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
