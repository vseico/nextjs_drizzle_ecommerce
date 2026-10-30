"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function AddressModal({
  isOpen,
  onClose,
}: AddAddressModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log(formData);

    onClose();
  };
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto hide-scrollbar rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        {/* Close Button  */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background text-muted transition hover:bg-border"
        >
          <IoClose size={20} />
        </button>
        {/* Header  */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-text">Add New Address</h2>
          <p>Enter your delivery address below.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-text"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-text"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-text"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+234 800 000 0000"
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 "
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium tex-text"
            >
              Street Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition "
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium tex-text"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Benin City"
                required
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="mb-2 block text-sm font-medium text-text"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Edo"
                required
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Postal Code $ Country  */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="postalCode" className="mb-2 block text-sm font-medium text-text">
                    Postal Code
                </label>
                <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="300001" required className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" />

            </div>
            <div>
                <label htmlFor="country" className="mb-2 block text-sm font-medium text-text">
                    Country
                </label>
                <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Nigeria" required className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm tex-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20" />

            </div>
          </div>
          {/* Buttons  */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="w-full cursor-pointer rounded-lg border border-border px-5 py-3 text-sm font-medium text-text transition hover:bg-background sm:w-auto">Cancel</button>
            <button type="submit" className="w-full cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary-hover sm:w-auto">
                Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
