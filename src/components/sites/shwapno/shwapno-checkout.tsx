"use client";

import Image from "next/image";
import {
  ChevronDown,
  Clock3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SHWAPNO_CHECKOUT_STORAGE_KEY,
  type ShwapnoCheckoutItem,
} from "@/lib/shwapno-cart";

type DeliveryAddress = {
  id: string;
  label: string;
  details: string;
};

const initialAddresses: DeliveryAddress[] = [
  { id: "home", label: "Home", details: "Dhaka, Bangladesh" },
  { id: "office", label: "Office", details: "Dhaka, Bangladesh" },
];

const deliverySlots = [
  { id: "today", title: "Today", hours: "7:00 PM - 9:00 PM" },
  { id: "tomorrow", title: "Tomorrow", hours: "9:00 AM - 12:00 PM" },
];

const countries = [
  { id: "BD", flag: "🇧🇩", prefix: "+880", name: "Bangladesh" },
  { id: "IN", flag: "🇮🇳", prefix: "+91", name: "India" },
  { id: "US", flag: "🇺🇸", prefix: "+1", name: "United States" },
];

function isCheckoutItem(value: unknown): value is ShwapnoCheckoutItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "image" in value &&
    typeof value.image === "string" &&
    /^[\w.-]+$/.test(value.image) &&
    "price" in value &&
    typeof value.price === "string" &&
    /^\d+(?:\.\d{1,2})?$/.test(value.price) &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  );
}

function readCheckoutItems(): ShwapnoCheckoutItem[] {
  const storedItems = window.localStorage.getItem(SHWAPNO_CHECKOUT_STORAGE_KEY);
  if (storedItems === null) return [];

  const parsedItems: unknown = JSON.parse(storedItems);
  if (!Array.isArray(parsedItems) || !parsedItems.every(isCheckoutItem)) {
    throw new Error("The saved checkout basket has an invalid format.");
  }
  return parsedItems;
}

function formatTaka(amount: number) {
  return Number.isInteger(amount)
    ? String(amount)
    : amount.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function ShwapnoCheckout() {
  const [items, setItems] = useState<ShwapnoCheckoutItem[]>([]);
  const [basketError, setBasketError] = useState("");
  const [loginOpen, setLoginOpen] = useState(true);
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [googleMessage, setGoogleMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("today");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      try {
        const savedItems = readCheckoutItems();
        if (!cancelled) setItems(savedItems);
      } catch (error) {
        console.error("Unable to load the Shwapno checkout basket.", error);
        if (!cancelled) {
          setBasketError("We couldn't load your basket. Please return to your cart and try again.");
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loginOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLoginOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [loginOpen]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items],
  );

  const openLogin = () => {
    setLoginMessage("");
    setGoogleMessage("");
    setLoginOpen(true);
  };

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[1-9]\d{9}$/.test(phone)) {
      setLoginMessage("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoginMessage("Mobile sign-in is not connected in this demo.");
  };

  const addAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!addressLabel.trim() || !addressDetails.trim()) {
      setAddressError("Enter both an address name and delivery address.");
      return;
    }

    const address = {
      id: `${Date.now()}`,
      label: addressLabel.trim(),
      details: addressDetails.trim(),
    };
    setAddresses((current) => [...current, address]);
    setSelectedAddress(address.id);
    setAddressLabel("");
    setAddressDetails("");
    setAddressError("");
    setAddressFormOpen(false);
  };

  return (
    <main className="shwapno-site shwapno-checkout-page">
      <header className="shwapno-checkout-header">
        <h1>Checkout</h1>
      </header>

      <div className="shwapno-checkout-content">
        <section className="shwapno-checkout-time">
          <h2>Delivery Time</h2>
          <div className="shwapno-checkout-time-options">
            {deliverySlots.map((slot) => (
              <button
                className={selectedSlot === slot.id ? "is-selected" : ""}
                key={slot.id}
                type="button"
                aria-pressed={selectedSlot === slot.id}
                onClick={() => setSelectedSlot(slot.id)}
              >
                <Clock3 aria-hidden="true" size={18} />
                <span>
                  <strong>{slot.title}</strong>
                  <small>{slot.hours}</small>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="shwapno-checkout-details">
          <div className="shwapno-checkout-address-heading">
            <h2>Delivery address</h2>
            <button type="button" onClick={() => setAddressFormOpen(true)}>
              <Plus aria-hidden="true" size={20} />
              Add new
            </button>
          </div>
          <div className="shwapno-checkout-addresses">
            {addresses.map((address) => (
              <article
                className={`shwapno-checkout-address ${selectedAddress === address.id ? "is-selected" : ""}`}
                key={address.id}
              >
                <label>
                  <input
                    type="radio"
                    name="delivery-address"
                    checked={selectedAddress === address.id}
                    onChange={() => setSelectedAddress(address.id)}
                  />
                  <span>
                    <strong>{address.label}</strong>
                    <small>{address.details}</small>
                  </span>
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${address.label} address`}
                  onClick={() => {
                    setAddresses((current) => current.filter((entry) => entry.id !== address.id));
                    if (selectedAddress === address.id) {
                      setSelectedAddress(addresses.find((entry) => entry.id !== address.id)?.id ?? "");
                    }
                  }}
                >
                  <Trash2 aria-hidden="true" size={16} />
                </button>
              </article>
            ))}
            {addresses.length === 0 && (
              <p className="shwapno-checkout-empty-address">
                Add a delivery address to continue.
              </p>
            )}
          </div>

          <section className="shwapno-checkout-order" aria-label="Order summary">
            <div className="shwapno-checkout-order-items">
              {basketError ? (
                <p className="shwapno-checkout-basket-error" role="alert">{basketError}</p>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <article className="shwapno-checkout-item" key={item.id}>
                    <Image
                      src={`/sites/shwapno/assets/${item.image}`}
                      alt=""
                      width={48}
                      height={48}
                    />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.quantity} × ৳{formatTaka(Number(item.price))}</small>
                    </span>
                    <strong>৳{formatTaka(Number(item.price) * item.quantity)}</strong>
                  </article>
                ))
              ) : (
                <p className="shwapno-checkout-empty-basket">Your basket is empty.</p>
              )}
            </div>
            <div className="shwapno-checkout-total">
              <strong>Total:</strong>
              <strong>৳{formatTaka(total)}</strong>
            </div>
            <div className="shwapno-checkout-confirm-row">
              <strong>Total: ৳{formatTaka(total)}</strong>
              <button type="button" onClick={openLogin}>
                Confirm
              </button>
            </div>
          </section>
        </section>
      </div>

      {addressFormOpen && (
        <div
          className="shwapno-checkout-form-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAddressFormOpen(false);
          }}
        >
          <form
            className="shwapno-checkout-address-form"
            onSubmit={addAddress}
          >
            <button
              className="shwapno-checkout-form-close"
              type="button"
              aria-label="Close address form"
              onClick={() => setAddressFormOpen(false)}
            >
              <X aria-hidden="true" size={19} />
            </button>
            <h2>Add delivery address</h2>
            <label>
              Address name
              <input
                value={addressLabel}
                onChange={(event) => setAddressLabel(event.currentTarget.value)}
                placeholder="Home, Office..."
              />
            </label>
            <label>
              Address
              <textarea
                value={addressDetails}
                onChange={(event) => setAddressDetails(event.currentTarget.value)}
                placeholder="Enter your delivery address"
                rows={3}
              />
            </label>
            {addressError && <p role="alert">{addressError}</p>}
            <button className="shwapno-checkout-save-address" type="submit">Save address</button>
          </form>
        </div>
      )}

      {loginOpen && (
        <div
          className="shwapno-checkout-login-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLoginOpen(false);
          }}
        >
          <section
            className="shwapno-checkout-login"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shwapno-checkout-login-title"
          >
            <div className="shwapno-checkout-brand-mark" aria-hidden="true">
              <span>স্বপ্ন</span>
            </div>
            <button
              className="shwapno-checkout-login-close"
              type="button"
              aria-label="Close sign in"
              onClick={() => setLoginOpen(false)}
            >
              <X aria-hidden="true" size={25} />
            </button>
            <h2 id="shwapno-checkout-login-title">Sign in to get best online experience</h2>
            <form onSubmit={submitLogin}>
              <div className="shwapno-checkout-phone">
                <button
                  className="shwapno-checkout-country-button"
                  type="button"
                  aria-label={`Country: ${selectedCountry.name}`}
                  aria-expanded={countryMenuOpen}
                  onClick={() => setCountryMenuOpen((open) => !open)}
                >
                  <span>{selectedCountry.flag}</span>
                  <ChevronDown aria-hidden="true" size={13} />
                </button>
                {countryMenuOpen && (
                  <div className="shwapno-checkout-country-menu" role="listbox" aria-label="Choose a country">
                    {countries.map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        role="option"
                        aria-selected={selectedCountry.id === country.id}
                        onClick={() => {
                          setSelectedCountry(country);
                          setCountryMenuOpen(false);
                        }}
                      >
                        {country.flag} {country.name} ({country.prefix})
                      </button>
                    ))}
                  </div>
                )}
                <span className="shwapno-checkout-country-prefix">{selectedCountry.prefix}</span>
                <input
                  aria-label="Mobile number"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="1XXXXXXXXX"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.currentTarget.value.replace(/\D/g, ""));
                    setLoginMessage("");
                  }}
                />
              </div>
              <button className="shwapno-checkout-login-submit" type="submit">Login</button>
              {loginMessage && <p className="shwapno-checkout-login-message" role="status">{loginMessage}</p>}
            </form>
            <p className="shwapno-checkout-or">or, sign in with</p>
            <button
              className="shwapno-checkout-google"
              type="button"
              onClick={() => setGoogleMessage("Google sign-in is not connected in this demo.")}
            >
              <span aria-hidden="true">G</span>
              Sign in
            </button>
            {googleMessage && <p className="shwapno-checkout-login-message" role="status">{googleMessage}</p>}
          </section>
        </div>
      )}
    </main>
  );
}
