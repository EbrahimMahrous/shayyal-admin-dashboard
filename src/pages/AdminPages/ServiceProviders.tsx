// ** Style
import styles from "../../styles/Pages/Admin/ServiceProviders.module.css";
// ** Hooks
import { useEffect, useState, type ChangeEvent } from "react";
// ** Icons
import { Pencil, Trash2 } from "lucide-react";

interface Provider {
  id: number;
  name: string;
  service: string;
  email: string;
}

export default function ServiceProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

  useEffect(() => {
    setProviders([
      { id: 1, name: "شركة النظافة الحديثة", service: "تنظيف", email: "clean@modern.com" },
      { id: 2, name: "خدمات فنية", service: "صيانة", email: "fix@support.com" },
      { id: 3, name: "المهندسون", service: "هندسة", email: "eng@services.com" },
    ]);
  }, []);

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProvider) return;
    setProviders((prev) =>
      prev.map((p) => (p.id === selectedProvider.id ? selectedProvider : p))
    );
    setIsDialogOpen(false);
  };

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Provider
  ) => {
    if (selectedProvider) {
      setSelectedProvider({ ...selectedProvider, [field]: e.target.value });
    }
  };

  const handleDelete = (provider: Provider) => {
    setProviderToDelete(provider);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (providerToDelete) {
      setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
      setIsDeleteDialogOpen(false);
      setProviderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProviderToDelete(null);
  };

  const filtered = providers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.header}>
        <h2 className={styles.title}>مزودي الخدمة</h2>
        <input
          type="text"
          placeholder="ابحث باسم المزود..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>الخدمة</th>
            <th>البريد الإلكتروني</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.service}</td>
              <td>{p.email}</td>
              <td className={styles.actionButtons}>
                <button onClick={() => handleEdit(p)} className={styles.editBtn}>
                  <Pencil className={styles.icon} />
                </button>
                <button onClick={() => handleDelete(p)} className={styles.deleteBtn}>
                  <Trash2 className={styles.icon} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog تعديل */}
      {selectedProvider && isDialogOpen && (
        <div className={styles.dialogOverlay} onClick={() => setIsDialogOpen(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>تعديل المزود رقم {selectedProvider.id}</h3>
            <input
              value={selectedProvider.name}
              onChange={(e) => handleFieldChange(e, "name")}
              placeholder="الاسم"
              className={styles.dialogInput}
            />
            <input
              value={selectedProvider.service}
              onChange={(e) => handleFieldChange(e, "service")}
              placeholder="الخدمة"
              className={styles.dialogInput}
            />
            <input
              value={selectedProvider.email}
              onChange={(e) => handleFieldChange(e, "email")}
              placeholder="البريد الإلكتروني"
              className={styles.dialogInput}
            />
            <button onClick={handleUpdate} className={styles.updateButton}>
              تحديث
            </button>
          </div>
        </div>
      )}

      {/* Dialog حذف */}
      {providerToDelete && isDeleteDialogOpen && (
        <div className={styles.dialogOverlay} onClick={cancelDelete}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3>هل أنت متأكد أنك تريد حذف مزود الخدمة؟</h3>
            <div className={styles.confirmButtons}>
              <button className={`${styles.confirmBtn} ${styles.yes}`} onClick={confirmDelete}>
                نعم
              </button>
              <button className={`${styles.confirmBtn} ${styles.no}`} onClick={cancelDelete}>
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
