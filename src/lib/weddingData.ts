export interface StoryItem {
  title: string;
  text: string;
  chip: string;
  photo: string;
  pos?: string;
  zoom?: string;
  zpos?: string;
}

export interface ScheduleEvent {
  name: string;
  time: string;
  iso: string;
  icon: string;
  note?: string;
  side?: 'groom' | 'bride' | 'joint';
  sideLabel?: string;
}

export interface ScheduleDay {
  n: string;
  weekday: string;
  tag: string;
  events: ScheduleEvent[];
}

export interface WeddingData {
  openingNames: { bride: string; groom: string };
  logo: string;
  date: {
    start: string;
    label: [string, string, string];
    short: string;
  };
  story: StoryItem[];
  schedule: ScheduleDay[];
  venue: {
    name: string;
    city: string;
    address: string;
    photo: string;
    map: string;
    embedUrl?: string;
  };
  families: {
    groom: { label: string; name: string; of: string; parents: string };
    bride: { label: string; name: string; of: string; parents: string };
  };
  closing: { line: string; fin: string };
  openingPhoto: string;
  music: string;
}

export const weddingData: WeddingData = {
  openingNames: { bride: "Siddhi", groom: "Jainam" },
  logo: "/assets/images/logo.webp",
  date: {
    start: "2026-12-10T10:30:00",
    label: ["11 — 12", "DECEMBER", "2026"],
    short: "12 DEC 2026"
  },
  story: [
    { title: "Better Together",   text: "Side by side, in every season.",                chip: "The Beginning", photo: "/assets/images/better-together.jpg", pos: "50% 20%" },
    { title: "Little Moments",    text: "Coffee dates and quiet understanding.",        chip: "Falling",       photo: "/assets/images/little-moments.jpg", pos: "50% 45%" },
    { title: "Our Favourite Day", text: "Good coffee, great company, always.",          chip: "Always",        photo: "/assets/images/favourite-day1.jpg", pos: "50% 30%" }
  ],
  schedule: [
    {
      n: "10",
      weekday: "Thursday",
      tag: "Day one",
      events: [
        {
          name: "Shubh Ganpati Sthapana",
          time: "10:30 AM",
          iso: "20261210T103000",
          note: "Auspicious invocation of Lord Ganesha to commence the wedding festivities",
          icon: "kalash",
          side: "groom",
          sideLabel: "Groom's Side"
        }
      ]
    },
    {
      n: "11",
      weekday: "Friday",
      tag: "Day two",
      events: [
        {
          name: "Mataji Pujan & Kalash",
          time: "09:00 AM",
          iso: "20261211T090000",
          note: "Kuldevi Mataji pujan and auspicious Ghat sthapana",
          icon: "kalash",
          side: "groom",
          sideLabel: "Groom's Side"
        },
        {
          name: "Mayra",
          time: "01:00 PM",
          iso: "20261211T130000",
          note: "Traditional maternal uncle's welcome & Mamera blessings",
          icon: "bangles",
          side: "groom",
          sideLabel: "Groom's Side"
        },
        {
          name: "Shahi Bindoli",
          time: "07:00 PM",
          iso: "20261211T190000",
          note: "Royal festive procession with dhol, dance & vibrant celebrations",
          icon: "dhol",
          side: "groom",
          sideLabel: "Groom's Side"
        }
      ]
    },
    {
      n: "12",
      weekday: "Saturday",
      tag: "Day three",
      events: [
        {
          name: "Ganpati Sthapana & Kalash",
          time: "07:00 AM",
          iso: "20261212T070000",
          note: "Auspicious Ganesh pujan and sacred Kalash sthapana ceremony",
          icon: "kalash",
          side: "bride",
          sideLabel: "Bride's Side"
        },
        {
          name: "The Celebration Carnival",
          time: "09:00 AM",
          iso: "20261212T090000",
          note: "Morning fiesta filled with music, lively games & refreshments",
          icon: "flower",
          side: "joint",
          sideLabel: "Both Families"
        },
        {
          name: "Engagement, Tilak & Chidi",
          time: "01:30 PM",
          iso: "20261212T133000",
          note: "Exchange of rings, auspicious Tilak ceremony & Godh Bharai (Chidi)",
          icon: "rings",
          side: "joint",
          sideLabel: "Both Families"
        },
        {
          name: "Mayra",
          time: "04:00 PM",
          iso: "20261212T160000",
          note: "Maternal uncle's ceremonial blessings & traditional gift presentation",
          icon: "bangles",
          side: "bride",
          sideLabel: "Bride's Side"
        },
        {
          name: "Shahi Toran & Welcoming",
          time: "06:00 PM",
          iso: "20261212T180000",
          note: "Auspicious Toran ritual and grand welcome of the Baraat",
          icon: "garland",
          side: "joint",
          sideLabel: "Both Families"
        },
        {
          name: "Shubh Vivah (Phere)",
          time: "Midnight",
          iso: "20261212T235900",
          note: "Seven sacred vows around the holy fire under starlit skies",
          icon: "flame",
          side: "joint",
          sideLabel: "Both Families"
        }
      ]
    }
  ],
  venue: {
    name: "Shree Jain Diwakar Tapovan Bhawan",
    city: "Dungla",
    address: "Shree Jain Diwakar Tapovan Bhawan, Dungla",
    photo: "",
    map: "https://www.google.com/maps/place/Alwa+Mata+Temple+Dungla/@24.5043507,74.357005,17z",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3630.4545021607523!2d74.357005!3d24.504350700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3966365566681cb7%3A0xb7581341a4182aaa!2sAlwa%20Mata%20Temple%20Dungla!5e0!3m2!1sen!2sin!4v1794594809971!5m2!1sen!2sin"
  },
  families: {
    groom: { label: "The Groom", name: "Jainam", of: "son of",      parents: "Ramesh Nalwaya & Seema Nalwaya" },
    bride: { label: "The Bride", name: "Siddhi", of: "daughter of", parents: "Manak Porwal & Snehlata Porwal" }
  },
  closing: {
    line: "A new chapter begins.",
    fin: "See you at the celebration"
  },
  openingPhoto: "/assets/images/opening.jpg",
  music: "/assets/music/wedding-song.mp3"
};

