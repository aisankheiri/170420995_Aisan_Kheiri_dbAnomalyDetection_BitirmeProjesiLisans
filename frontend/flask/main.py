import pandas as pd
from mlxtend.frequent_patterns import fpgrowth, association_rules
from mlxtend.preprocessing import TransactionEncoder
import seaborn as sns
import matplotlib.pyplot as plt
from flask import Flask, send_file ,jsonify,request
from flask_cors import CORS
from scipy import stats
from sklearn.utils import resample
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, recall_score, accuracy_score, f1_score,classification_report
import io
from sklearn.neighbors import KNeighborsClassifier


app = Flask(__name__)
CORS(app)

# Veri setini yükleme
df = pd.read_csv('./OYAKint.csv')

# 'page life expectancy' değerini kategorilere ayırma
def categorize_page_life_expectancy(value):
    if value < 301:
        return 'Dusuk'
    elif 301 <= value < 5000:
        return 'Orta'
    else:
        return 'Yuksek'

# Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

# Her bir satır için 'alışveriş sepeti' oluşturma
transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()

# Veri setini FP-Growth için uygun formata dönüştürme
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df_ready_for_fp = pd.DataFrame(te_ary, columns=te.columns_)

# FP-Growth algoritmasını kullanarak sık kullanılan item setlerini bulma
frequent_itemsets = fpgrowth(df_ready_for_fp, min_support=0.1, use_colnames=True)

# Kuralları çıkarma
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
grouped = df.groupby(['InstanceID', 'page_life_category']).size().unstack(fill_value=0)

# Grafiği oluşturma ve kaydetme
plt.figure(figsize=(10, 8))
sns.heatmap(grouped, annot=True, fmt="d", cmap="YlGnBu")
plt.title('Page Life Expectancy Kategorilerine Göre Isı Haritası')
plt.xlabel('Page Life Kategorisi')
plt.ylabel('InstanceID')
plt.savefig('./img/heatmap.png')
plt.close()



@app.route('/get_heatmap')
def get_heatmap():
    return send_file('./img/heatmap.png', mimetype='image/png')


@app.route('/get_heatmap2')
def get_heatmap2():
    veriler = pd.read_csv('./OYAKint.csv')
    veriler_h = veriler.head()
    
    X = veriler.iloc[:, 2:36].values
    Y = veriler.iloc[:, 2:7]
    Z = veriler.iloc[:, 7:36]

    korelasyon_matrisi = Y.corr()

    plt.figure(figsize=(10, 8))
    sns.heatmap(korelasyon_matrisi, annot=True, fmt=".2f", cmap='coolwarm')

    # Grafiği ./img dosyasına kaydetme
    plt.savefig('./img/heatmap2.png')
    plt.close()

    return send_file('./img/heatmap2.png', mimetype='image/png')



@app.route('/get_istatistikler')
def get_statistics():
    dosya_yolu = pd.read_csv('./OYAKint.csv')
    df = dosya_yolu
    df = df.iloc[:, 2:8]
    
    # İstatistiksel özetleri saklamak için boş bir DataFrame oluştur
    istatistikler = pd.DataFrame(columns=['Özellik', 'Mod', 'Medyan', 'Standart Sapma', 'Ortalama', 'Minimum', 'Maksimum'])

    for kolon in df.columns:
        # Mod hesaplama (birden fazla mod olabilir)
        mod = df[kolon].mode().values

        # Eğer birden fazla mod değeri varsa, bunları birleştir
        mod_str = ', '.join(map(str, mod))

        # Diğer istatistikleri hesapla
        medyan = df[kolon].median()
        standart_sapma = df[kolon].std()
        ortalama = df[kolon].mean()
        minimum = df[kolon].min()
        maksimum = df[kolon].max()

        # Hesaplanan istatistikleri DataFrame'e ekle
        istatistikler.loc[len(istatistikler)] = {
            'Özellik': kolon,
            'Mod': mod_str,
            'Medyan': medyan,
            'Standart Sapma': standart_sapma,
            'Ortalama': ortalama,
            'Minimum': minimum,
            'Maksimum': maksimum
        }

    # İstatistiksel özetleri JSON formatına dönüştürerek döndür
    return jsonify(istatistikler.to_dict(orient='records'))


@app.route('/generate_and_send_plot')
def generate_and_send_plot():
    # Veri setini yükle
    df = pd.read_csv('./OYAKint.csv')

    # 'page life expectancy' kolonunu etiketleme
    df['page_life_expectancy_etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Altıncı indeksten son indekse kadar olan sütunlar
    altinci_sutundan_sonra = df.columns[6:]  # Altıncı indeksten itibaren sütun isimlerini al

    # İlişkileri saklamak için boş bir DataFrame oluştur
    iliskiler_df = pd.DataFrame(columns=['Sütun', '1 için Ortalama', '0 için Ortalama'])

    for sutun in altinci_sutundan_sonra:
        # 1 ve 0 değerlerinin ortalamalarını hesapla
        bir_ortalama = df[df[sutun] == 1]['page_life_expectancy_etiket'].mean()
        sifir_ortalama = df[df[sutun] == 0]['page_life_expectancy_etiket'].mean()

        # Yeni verileri DataFrame'e ekle
        if not pd.isna(bir_ortalama) and bir_ortalama != 0:
            yeni_satir = pd.DataFrame({'Sütun': [sutun], '1 için Ortalama': [bir_ortalama], '0 için Ortalama': [sifir_ortalama]})
            iliskiler_df = pd.concat([iliskiler_df, yeni_satir], ignore_index=True)

    # Sonuçları göster
    print(iliskiler_df)

    # Grafik boyutunu ayarla
    fig, ax = plt.subplots(figsize=(12, 8))

    # Her bir sütun için, 1 ve 0 değerlerinin ortalamalarını bar grafik olarak çizdir
    bar_genisligi = 0.35
    index = range(len(iliskiler_df))

    ax.bar(index, iliskiler_df['1 için Ortalama'], bar_genisligi, label='1 için Ortalama', color='blue')
    ax.bar([p + bar_genisligi for p in index], iliskiler_df['0 için Ortalama'], bar_genisligi, label='0 için Ortalama', color='red')

    # Grafik başlığı ve eksen etiketlerini ekle
    ax.set_xlabel('Kolonlar')
    ax.set_ylabel('Ortalama Etiket Değeri')
    ax.set_title('Diğer Kolon Değerlerinin "Page Life Expectancy" Üzerindeki Etkisi')
    ax.set_xticks([p + bar_genisligi/2 for p in index])
    ax.set_xticklabels(iliskiler_df['Sütun'], rotation=90)

    # Efsaneyi ekle
    ax.legend()

    # Görüntüyü kaydet
    plt.savefig('./img/plot.png')

    # Görüntüyü React tarafına gönder
    return send_file('./img/plot.png', mimetype='image/png')


@app.route('/get_relationships')
def get_relationships():
    df = pd.read_csv('./OYAKint.csv')
    df['page_life_expectancy_etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)
    altinci_sutundan_sonra = df.columns[6:]

    iliskiler_df = pd.DataFrame(columns=['Sütun', '1 için Ortalama', '0 için Ortalama'])

    for sutun in altinci_sutundan_sonra:
        bir_ortalama = df[df[sutun] == 1]['page_life_expectancy_etiket'].mean()
        sifir_ortalama = df[df[sutun] == 0]['page_life_expectancy_etiket'].mean()

        if not pd.isna(bir_ortalama) and bir_ortalama != 0:
            yeni_satir = pd.DataFrame({'Sütun': [sutun], '1 için Ortalama': [bir_ortalama], '0 için Ortalama': [sifir_ortalama]})
            iliskiler_df = pd.concat([iliskiler_df, yeni_satir], ignore_index=True)

    return jsonify(iliskiler_df.to_dict(orient='records'))

@app.route('/get_5data')
def get_data():
    df = pd.read_csv('./OYAKint.csv')
    data = df.head(5)
    columns = data.columns.tolist()
    rows = data.values.tolist()
    return jsonify(columns, rows)


@app.route('/get_fulldata')
def get_fulldata():
    df = pd.read_csv('./OYAKint.csv')
    columns = df.columns.tolist()
    rows = df.values.tolist()
    return jsonify(columns, rows)


@app.route('/get_dataframe_summary')
def get_dataframe_summary():
    df = pd.read_csv('./OYAKint.csv')
    summary_dict = df.describe().T.to_dict()
    return jsonify(summary_dict)

@app.route('/get_pie_chart')
def get_pie_chart():
    # Veri setini yükleme
    df = pd.read_csv('./OYAKint.csv')

    # 'page life expectancy' değerini kategorilere ayırma
    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Kategori frekanslarını hesaplama
    labels = df['page_life_category'].value_counts()
    w = (list(labels.index), list(labels.values))

    # Pasta grafiği için explode ayarları
    explode = [0, 0, 0.1]  # Yüksek kategorisini biraz öne çıkar

    # Pasta grafiği çizme
    fig = plt.figure(figsize=(7, 5))
    plt.pie(w[1], explode=explode, labels=w[0], shadow=True, startangle=90,
            colors=['red', 'green', 'blue'], autopct='%1.1f%%', textprops={'fontsize': 15})
    plt.axis('equal')  # Bu sayede pasta grafiği yuvarlak görünür
    plt.legend(title='[page life expectancy] değerleri', loc='upper left')

    # Grafik dosyasını kaydetme
    fig.savefig('./img/pie_chart.png')
    return send_file('./img/pie_chart.png', mimetype='image/png')


def preprocess_data():
    # Veri setini yükle
    df = pd.read_csv('./OYAKint.csv')

    # 'page life expectancy' kolonunu etiketleme
    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Orijinal sınıf dağılımını görselleştirme ve kaydetme
    plt.figure(figsize=(8, 4))
    df['etiket'].value_counts().plot(kind='bar', color=['blue', 'red'])
    plt.title('Orijinal Sınıf Dağılımı')
    plt.xlabel('Etiket')
    plt.ylabel('Frekans')
    plt.xticks([0, 1], ['page life expectancy (>300)', 'page life expectancy (0-300)'], rotation=0)
    plt.savefig('./img/orijinal_sinifdagilimi.png')

    # Azınlık ve çoğunluk sınıflarını ayır
    df_majority = df[df['etiket'] == 0]
    df_minority = df[df['etiket'] == 1]

    # Azınlık sınıfını çoğaltma (Oversampling)
    df_minority_upsampled = resample(df_minority, replace=True, n_samples=len(df_majority), random_state=123)
    df_upsampled = pd.concat([df_majority, df_minority_upsampled])

    # Çoğunluk sınıfını azaltma (Undersampling)
    df_majority_downsampled = resample(df_majority, replace=False, n_samples=len(df_minority), random_state=123)
    df_downsampled = pd.concat([df_majority_downsampled, df_minority])

    # Güncellenmiş sınıf dağılımlarını görselleştirme ve kaydetme
    fig, ax = plt.subplots(1, 2, figsize=(14, 5), sharey=True)
    df_upsampled['etiket'].value_counts().plot(kind='bar', ax=ax[0], color=['blue', 'red'])
    ax[0].set_title('Oversampling Sonrası Sınıf Dağılımı')
    ax[0].set_xlabel('Etiket')
    ax[0].set_ylabel('Frekans')
    ax[0].set_xticklabels(['page life expectancy (>300)', 'page life expectancy (0-300)'], rotation=0)

    df_downsampled['etiket'].value_counts().plot(kind='bar', ax=ax[1], color=['blue', 'red'])
    ax[1].set_title('Undersampling Sonrası Sınıf Dağılımı')
    ax[1].set_xticklabels(['page life expectancy (>300)', 'page life expectancy (0-300)'], rotation=0)
    ax[1].set_ylabel('Frekans')
    ax[1].set_xlabel('Etiket')
    plt.savefig('./img/undersampling_sinifdagilimi.png')

@app.route('/get_orijinal_sinifdagilimi')
def get_orijinal_sinifdagilimi():
    return send_file('./img/orijinal_sinifdagilimi.png', mimetype='image/png')

@app.route('/get_undersampling_sinifdagilimi')
def get_undersampling_sinifdagilimi():
    return send_file('./img/undersampling_sinifdagilimi.png', mimetype='image/png')


@app.route('/get_svm_performance', methods=['POST'])
def get_svm_performance():
    form_data = request.json

    # Form verilerinden çekirdek ve C değerlerini alın
    kernel = form_data.get('kernel')
    C = form_data.get('C')

    if kernel is None or C is None:
        return jsonify({'error': 'Eksik veri. Çekirdek ve C değeri gereklidir.'}), 400

    df = pd.read_csv('./OYAKint.csv')
    X = df.iloc[:, 2:7]  # 2 ila 6 arasındaki sütunlar
    y = df['page life expectancy'] > 300  # Hedef etiket

    # Veriyi eğitim ve test kümelerine bölelim
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # SVM modelini oluştur
    svm_model = SVC(kernel=kernel, C=C)
    svm_model.fit(X_train, y_train)

    # Test verilerini tahmin et
    y_pred = svm_model.predict(X_test)

    # Model performansını değerlendir
    conf_matrix = confusion_matrix(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    result = {
        'confusion_matrix': conf_matrix.tolist(),
        'recall': recall,
        'accuracy': accuracy,
        'f1': f1,
        'classification_report': classification_report(y_test, y_pred, output_dict=True)
    }

    return jsonify(result)

@app.route('/get_confusion_matrix_SVM', methods=['POST'])
def get_confusion_matrix():
    data = request.json
    C = data['C']
    kernel = data['kernel']

    df = pd.read_csv('./OYAKint.csv')
    X = df.iloc[:, 2:7]  # 2 ila 6 arasındaki sütunlar
    y = df['page life expectancy'] > 300  # Hedef etiket

    # Veriyi eğitim ve test kümelerine bölelim
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # SVM modelini oluştur
    svm_model = SVC(C=C, kernel=kernel)
    svm_model.fit(X_train, y_train)

    # Test verilerini tahmin et
    y_pred = svm_model.predict(X_test)

    # Confusion matrix'i oluştur
    cm = confusion_matrix(y_test, y_pred)

    # Confusion matrix'i görselleştir
    plt.figure(figsize=(4, 4))
    sns.heatmap(cm, annot=True, linewidths=0.5, cmap='Blues', fmt='d')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.savefig('./img/confusion_matrix.png')  # Confusion matrix görüntüsünü kaydet

    # Kaydedilen confusion matrix görüntüsünün yolunu döndür
    return send_file('./img/confusion_matrix.png', mimetype='image/png')



@app.route('/get_knn_performance')
def get_classification_report():
    df = pd.read_csv('./OYAKint.csv')
    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    label_counts = df['etiket'].value_counts()
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_sifira_gore = resample(df_majority, replace=False, n_samples=label_counts.min(), random_state=42)
    df_sifira_gore = pd.concat([df_sifira_gore, df_minority])
    X = df_sifira_gore.iloc[:, 2:]  # 2 ila 6 arasındaki sütunlar
    y = df_sifira_gore['page life expectancy'] > 300  # Hedef etiket
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=84)
    knn = KNeighborsClassifier(n_neighbors=3)  # K değeri
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)

    # Model performansını değerlendir
    conf_matrix = confusion_matrix(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)

    result = {
        'confusion_matrix': conf_matrix.tolist(),
        'recall': recall,
        'accuracy': accuracy,
        'f1': f1,
        'classification_report': classification_report(y_test, y_pred, output_dict=True)
    }

    return jsonify(result)


@app.route('/get_support_plot')
def get_plots():
    # Veri setini yükleme
    df = pd.read_csv('./OYAKint.csv')

    # Sayısal değerleri kategorilere ayırma
    categories = {
        'page life expectancy': [('Yuksek', 0, 300), ('Orta', 300, 5000), ('Dusuk', 5000, 50000)],
        '% privileged time': [('Dusuk', 0, 15), ('Orta', 15, 25), ('Yuksek', 25, 50)],
        'transactions/sec': [('Dusuk', 0, 300), ('Orta', 300, 5000), ('Yuksek', 5000, 20000)],
        'write transactions/sec': [('Dusuk', 0, 500), ('Orta', 500, 1500), ('Yuksek', 1500, 5000)],
        'logical connections': [('Dusuk', 0, 500), ('Orta', 500, 750), ('Yuksek', 750, 2000)]
    }

    for column, bins in categories.items():
        bin_edges = [b[1] for b in bins] + [float('inf')]
        labels = [b[0] for b in bins]
        df[column] = pd.cut(df[column], bins=bin_edges, labels=labels, right=False)

    # İşlemleri oluşturma (her satır bir işlem)
    transactions = df[list(categories.keys())].apply(lambda x: x.dropna().tolist(), axis=1).tolist()

    # FP-Growth için uygun formata dönüştürme
    te = TransactionEncoder()
    te_ary = te.fit(transactions).transform(transactions)
    df_ready_for_fp = pd.DataFrame(te_ary, columns=te.columns_)

    # FP-Growth algoritmasını kullanarak sık kullanılan item setlerini bulma
    frequent_itemsets = fpgrowth(df_ready_for_fp, min_support=0.05, use_colnames=True)

    # Kuralları çıkarma
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

    # Sık kullanılan öğe setlerinin destek değerlerini görselleştirme
    plt.figure(figsize=(10, 6))
    sns.barplot(data=frequent_itemsets, x='support', y=frequent_itemsets['itemsets'].astype(str))
    plt.title('Support of Frequent Itemsets')
    plt.xlabel('Support')
    plt.ylabel('Itemsets')
    plt.xticks(rotation=90)
    plt.tight_layout()
    support_plot_path = './img/support_plot.png'
    plt.savefig(support_plot_path)  # Plotı kaydet
    plt.close()

    # İlişkilendirme kurallarının güven değerlerini görselleştirme
    plt.figure(figsize=(12, 8))
    sns.barplot(data=rules, x='confidence', y=rules['antecedents'].astype(str) + '=>' + rules['consequents'].astype(str))
    plt.title('Confidence of Association Rules')
    plt.xlabel('Confidence')
    plt.ylabel('Association Rules')
    plt.xticks(rotation=90)
    plt.tight_layout()
    confidence_plot_path = './img/confidence_plot.png'
    plt.savefig(confidence_plot_path)  # Plotı kaydet
    plt.close()

    return send_file('./img/support_plot.png', mimetype='image/png')


@app.route('/get_confidence_plot')
def get_confidence_plot():
    return send_file('./img/confidence_plot.png', mimetype='image/png')


if __name__ == '__main__':
    app.run()