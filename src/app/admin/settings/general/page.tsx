"use client";
import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";

 type SocialLink = {
  name: string;
  link: string;
  icon: string;
};

 type Contact = {
  type: string;
  value: string;
};

 type Settings = {
  [key: string]: string | SocialLink[] | Contact[];
};

 export default function GeneralSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [changedFields, setChangedFields] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetch("/api/get-settings")
      .then((res) => res.json())
      .then((data: Settings) => {
        setSettings(data);
        setSocialLinks((data.socialLinks as SocialLink[]) || []);
        setContacts((data.contacts as Contact[]) || []);
      });
  }, []);

  const handleChange = (field: string, value: string | File) => {
    setChangedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    fetch("/api/save-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changedFields),
    }).then((res) => res.json());
    setChangedFields({});
  };

  return (
    <div className="p-6 w-full bg-white space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={Object.keys(changedFields).length === 0}>
          Save
        </Button>
      </div>

      {["Main Branch Location", "WhatsApp Number"].map((label) => (
        <div key={label} className="flex items-center space-x-4">
          <label className="w-1/4">{label}</label>
          <Input
            defaultValue={settings[label.toLowerCase().replace(/ /g, "_")] as string}
            onBlur={(e) => handleChange(label.toLowerCase().replace(/ /g, "_"), e.target.value)}
          />
        </div>
      ))}

      {["Loan Agreement", "Customer Agreement", "Thekedar Agreement", "Details of Material", "More Information"].map((label) => (
        <div key={label} className="flex items-center space-x-4">
          <label className="w-1/4">{label}</label>
          <Input type="file" accept="application/pdf" onChange={(e) => handleChange(label.toLowerCase().replace(/ /g, "_"), e.target.files?.[0] || "")} />
        </div>
      ))}

      <div>
        <label className="block mb-2">Social Media Links</label>
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              placeholder="Social Media Name"
              defaultValue={link.name}
              onBlur={(e) => handleChange(`social_${index}_name`, e.target.value)}
            />
            <Input
              placeholder="Link"
              defaultValue={link.link}
              onBlur={(e) => handleChange(`social_${index}_link`, e.target.value)}
            />
            <Input
              placeholder="Icon"
              defaultValue={link.icon}
              onBlur={(e) => handleChange(`social_${index}_icon`, e.target.value)}
            />
            <Button variant="destructive" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}>X</Button>
          </div>
        ))}
        <Button onClick={() => setSocialLinks([...socialLinks, { name: "", link: "", icon: "" }])}>Add More</Button>
      </div>

      <div>
        <label className="block mb-2">Contact Details</label>
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <select
              defaultValue={contact.type}
              onChange={(e) => handleChange(`contact_${index}_type`, e.target.value)}
              className="border p-2 rounded w-1/4"
            >
              <option value="phone">Phone</option>
              <option value="email">Email</option>
            </select>
            <Input
              placeholder="Contact Number/Email"
              defaultValue={contact.value}
              onBlur={(e) => handleChange(`contact_${index}_value`, e.target.value)}
            />
            <Button variant="destructive" onClick={() => setContacts(contacts.filter((_, i) => i !== index))}>X</Button>
          </div>
        ))}
        <Button onClick={() => setContacts([...contacts, { type: "", value: "" }])}>Add More</Button>
      </div>
    </div>
  );
}