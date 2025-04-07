import styles from './AdminPage.module.css';
import AdminCardTest from '../../components/Admin/AdminCard/AdminCardTest';
import AdminChartTest from '../../components/Admin/AdminChart/AdminChartTest';
import OrderTableTest from '../../components/Admin/OrderTable/OrderTableTest';
import TopProductsTest from '../../components/Admin/TopProducts/TopProductsTest';

function AdminPageTest() {
    return (
        <div className={styles.mainContent}>
            <div className={styles.topContent}>
                <div className={styles.cardSection}>
                    <AdminCardTest />
                </div>
            </div>
            <div className={styles.middleContent}>
                <div className={styles.chartContainer}>
                    <AdminChartTest />
                </div>
                <div className={styles.productContainer}>
                    <TopProductsTest />
                </div>
            </div>
            <div className={styles.bottomContent}>
                <OrderTableTest />
            </div>
        </div>
    );
}

export default AdminPageTest;
