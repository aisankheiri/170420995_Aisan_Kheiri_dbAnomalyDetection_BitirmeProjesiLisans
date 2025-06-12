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
from flask_bcrypt import Bcrypt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from fpdf import FPDF
import time
from flask import Flask, session
from dotenv import load_dotenv
import openai


plt.switch_backend('agg')  # Matplotlib backend ayari 

app = Flask(__name__)
app.secret_key = '8700338560135'
CORS(app)
bcrypt = Bcrypt(app)

yuklenen_dosya_path = "./model.csv"

class PDFWithBackground(FPDF):
    def __init__(self, background_image):
        super().__init__()
        self.background_image = background_image
        self.add_font('Arial', '', 'arial.ttf', uni=True)  # Arial fontunu 
        
    def header(self):
        self.image(self.background_image, x=0, y=0, w=self.w, h=self.h)
       
    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 0, align='L')
        self.ln(10)

    def add_text(self, text, title, x_position, y_position):
        self.chapter_title(title)
        
        # Türkçe karakterleri destekleyen bir font kullanma
        self.set_font('Arial', '', 12)  # Arial fontu genelde Türkçe karakterleri destekler
        self.set_xy(x_position, y_position)  # Belirtilen x ve y pozisyonlarına metni ekle
        self.multi_cell(0, 10, text)

    def add_image(self, image_path, title):
        self.add_page()
        self.chapter_title(title)
        
        # Resmin genişliği ve yüksekliği
        image_width = 130

        # PDF sayfa boyutunu al
        page_width = self.w
        
        # Resmin ortalanacaği koordinatlari hesapla
        x = (page_width - image_width) / 2
        self.image(image_path, x=x, y=40, w=120)



from datetime import datetime
from flask import request
import os


@app.route('/generate_pdf_svm', methods=['POST'])
def generate_pdf_svm():
    
    background_image_path = './img/image.png'
    pdf = PDFWithBackground(background_image_path)

    data = request.get_json()
    user_name = data.get('username')
    answer = data.get('answer')
    answer1 = data.get('answer1')
    answer2 = data.get ('answer2')
    answer3 = data.get ('answer3')
    answer4 = data.get ('answer4')
    answer5 = data.get ('answer5')
    answer6 = data.get ('answer6')
    answer7 = data.get ('answer7')
    answer8 = data.get ('answer8')
    c = data.get ('c')
    kernel = data.get ('kernel')
    sutun1 = data.get ('sutun1')
    sutun2 = data.get ('sutun2')
    test_size = data.get ('test_size')
    deger = data.get ('deger')
    operator = data.get ('operator')
    random_state = data.get('random_state')
    companyiddValue = data.get('companyiddValue')
    print("companyiddValue",companyiddValue)
    output_pdf_folder = './pdfs/'
    
    base_filename = "report_svm"

    # Hedef dosya adını oluşturma fonksiyonu
    def generate_unique_filename(folder, base_filename):
        counter = 0
        new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        # Dosya adı mevcut ise sayıyı artırarak yeni benzersiz dosya adını oluştur
        while os.path.exists(os.path.join(folder, new_filename)):
            counter += 1
            new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        return new_filename

    output_pdf_path = os.path.join(output_pdf_folder, generate_unique_filename(output_pdf_folder, base_filename))

    print(output_pdf_path)


    # Kullanici adindan sonra tarih ve saat bilgisini ekle
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = f"{user_name} // {current_datetime} // SVM Model"
    
    pdf.add_image("./img/dp_logo.png", user_info)
    pdf.set_font("helvetica", size=12)

    # Örnek metin
    sample_text =f"Sayın {user_name}\n" f"{current_datetime} saatinde SVM Modeli üzerinde yapılan çalışmaya özel olarak hazırlanan rapor sizin için sunulmuştur. Data platform şirketimizi tercih ettiğiniz için de ayrıca teşekkür ederiz. Bu raporda, model eğitiminin başarıyla tamamlanmasının ardından oluşturulan grafikler detaylı bir şekilde incelenmiş ve analiz edilmiştir.\nSeçtiğiniz SVM Modeli parametreleri arasında Kernel:{kernel} , C:{c} , sutun1:{sutun1} , sutun2:{sutun2} , test_size={test_size} ,random_state={random_state} ve Hedef Etiketi y = df['page life expectancy'] {operator} {deger} değerleri bulunmaktadır, bu parametrelerin sonuçları da raporda detaylı bir şekilde açıklanmıştır."
    pdf.add_text(sample_text, " ",10,100)

    pdf.add_image('./img/heatmap.png', 'Isi Haritasi')
    pdf.add_text(f'{answer1}','',10,150)
    pdf.add_image('./img/heatmap2.png', 'Kolerasyon Matrisi')
    pdf.add_text(f'{answer2}','',10,150)
    pdf.add_image('./img/plot.png', 'Page Life Expectancy')
    pdf.add_text(f'{answer3}','',10,150)
    pdf.add_image('./img/pie_chart.png', 'Pasta Grafigi')
    pdf.add_text(f'{answer4}','',10,150)
    pdf.add_image('./img/orijinal_sinifdagilimi.png', 'Orijinal Sinif Dagilimi')
    pdf.add_text(f'{answer5}','',10,130)
    pdf.add_image('./img/undersampling_sinifdagilimi.png', 'Undersampling ve Oversampling Sinif Dagilimi')
    pdf.add_text(f'{answer6}','',10,105)
    pdf.add_image('./img/support_plot.png', 'Support Plot')
    pdf.add_text(f'{answer7}','',10,140)
    pdf.add_image('./img/confidence_plot.png', 'Confidence Plot')
    pdf.add_text(f'{answer8}','',10,140)
    pdf.add_image('./img/confusion_matrix.png', 'SVM Karmasiklik Matrisi')
    pdf.add_text(f'{answer}','',10,160)

    # PDF oluşturma
    pdf.output(output_pdf_path)
    print("dosya yoluu",output_pdf_path)
    print("Yeni SVM PDF dosyasi kaydedildi.")

    return jsonify(output_pdf_path), 200


@app.route('/generate_pdf_rf', methods=['POST'])
def generate_pdf_rf():
    background_image_path = './img/image.png'
    
    
    pdf = PDFWithBackground(background_image_path)
    
    data = request.get_json()
    user_name = data.get('username')
    answer = data.get('answer')
    answer1 = data.get('answer1')
    answer2 = data.get ('answer2')
    answer3 = data.get ('answer3')
    answer4 = data.get ('answer4')
    answer5 = data.get ('answer5')
    answer6 = data.get ('answer6')
    answer7 = data.get ('answer7')
    answer8 = data.get ('answer8')
    n_estimators = data.get('n_estimators')
    max_depth = data.get('max_depth')
    min_samples_split = data.get('min_samples_split')
    criterion = data.get('criterion')
    test_size = data.get ('test_size')
    random_state = data.get('random_state')


    output_pdf_folder = './pdfs/'
    base_filename = "report_rf"

    # Hedef dosya adını oluşturma fonksiyonu
    def generate_unique_filename(folder, base_filename):
        counter = 0
        new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        # Dosya adı mevcut ise sayıyı artırarak yeni benzersiz dosya adını oluştur
        while os.path.exists(os.path.join(folder, new_filename)):
            counter += 1
            new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        return new_filename

    output_pdf_path = os.path.join(output_pdf_folder, generate_unique_filename(output_pdf_folder, base_filename))

    print(output_pdf_path)


    # Kullanici adindan sonra tarih ve saat bilgisini ekle
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = f"{user_name} // {current_datetime} // Random Forest Model"
    
    pdf.add_image("./img/dp_logo.png", user_info)
    pdf.set_font("helvetica", size=12)

    # Örnek metin
    sample_text =f"Sayın {user_name}\n" f"{current_datetime} saatinde SVM Modeli üzerinde yapılan çalışmaya özel olarak hazırlanan rapor sizin için sunulmuştur. Data platform şirketimizi tercih ettiğiniz için de ayrıca teşekkür ederiz. Bu raporda, model eğitiminin başarıyla tamamlanmasının ardından oluşturulan grafikler detaylı bir şekilde incelenmiş ve analiz edilmiştir.\nSeçtiğiniz KNN Modeli parametreleri arasında n_estimators:{n_estimators} , max_depth:{max_depth} , min_samples_split:{min_samples_split} , criterion:{criterion} , test_size={test_size} ve random_state={random_state} değerleri bulunmaktadır, bu parametrelerin sonuçları da raporda detaylı bir şekilde açıklanmıştır."
    pdf.add_text(sample_text, " ",10,100)

    pdf.add_image('./img/heatmap.png', 'Isi Haritasi')
    pdf.add_text(f'{answer1}','',10,150)
    pdf.add_image('./img/heatmap2.png', 'Kolerasyon Matrisi')
    pdf.add_text(f'{answer2}','',10,150)
    pdf.add_image('./img/plot.png', 'Page Life Expectancy')
    pdf.add_text(f'{answer3}','',10,150)
    pdf.add_image('./img/pie_chart.png', 'Pasta Grafigi')
    pdf.add_text(f'{answer4}','',10,150)
    pdf.add_image('./img/orijinal_sinifdagilimi.png', 'Orijinal Sinif Dagilimi')
    pdf.add_text(f'{answer5}','',10,130)
    pdf.add_image('./img/undersampling_sinifdagilimi.png', 'Undersampling ve Oversampling Sinif Dagilimi')
    pdf.add_text(f'{answer6}','',10,105)
    pdf.add_image('./img/support_plot.png', 'Support Plot')
    pdf.add_text(f'{answer7}','',10,140)
    pdf.add_image('./img/confidence_plot.png', 'Confidence Plot')
    pdf.add_text(f'{answer8}','',10,140)


    pdf.add_image('./img/confusion_matrix_RF.png', 'Confusion Matrix Random Forest')
    pdf.add_text(f'{answer}','',10,160)
    
    # PDF oluşturma
    pdf.output(output_pdf_path)
    print("Yeni RF PDF dosyasi kaydedildi.")
    add_reports_rf_data_adminpage()
    return jsonify(output_pdf_path), 200



@app.route('/generate_pdf_knn', methods=['POST'])
def generate_pdf_knn():
    background_image_path = './img/image.png'
    
    
    pdf = PDFWithBackground(background_image_path)
    
    data = request.get_json()
    user_name = data.get('username')
    answer = data.get('answer')
    answer1 = data.get('answer1')
    answer2 = data.get ('answer2')
    answer3 = data.get ('answer3')
    answer4 = data.get ('answer4')
    answer5 = data.get ('answer5')
    answer6 = data.get ('answer6')
    answer7 = data.get ('answer7')
    answer8 = data.get ('answer8')
    n_neighbors = data.get ('n_neighbors')
    metric = data.get ('metric')
    weights = data.get ('weights')
    sutun1 = data.get ('sutun1')
    sutun2 = data.get ('sutun2')
    test_size = data.get ('test_size')
    random_state = data.get('random_state')
    deger = data.get ('deger')
    operator = data.get ('operator')

    output_pdf_folder = './pdfs/'
    
    base_filename = "report_knn"

    # Hedef dosya adını oluşturma fonksiyonu
    def generate_unique_filename(folder, base_filename):
        counter = 0
        new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        # Dosya adı mevcut ise sayıyı artırarak yeni benzersiz dosya adını oluştur
        while os.path.exists(os.path.join(folder, new_filename)):
            counter += 1
            new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        return new_filename

    output_pdf_path = os.path.join(output_pdf_folder, generate_unique_filename(output_pdf_folder, base_filename))

    print(output_pdf_path)


    # Kullanici adindan sonra tarih ve saat bilgisini ekle
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = f"{user_name} // {current_datetime} // KNN Model"
    
    pdf.add_image("./img/dp_logo.png", user_info)
    pdf.set_font("helvetica", size=12)

    # Örnek metin
    sample_text =f"Sayın {user_name}\n" f"{current_datetime} saatinde KNN Modeli üzerinde yapılan çalışmaya özel olarak hazırlanan rapor sizin için sunulmuştur. Data platform şirketimizi tercih ettiğiniz için de ayrıca teşekkür ederiz. Bu raporda, model eğitiminin başarıyla tamamlanmasının ardından oluşturulan grafikler detaylı bir şekilde incelenmiş ve analiz edilmiştir.\nSeçtiğiniz KNN Modeli parametreleri arasında n_neighbors:{n_neighbors} , metric:{metric} ve weights:{weights} ,sutun1:{sutun1} , sutun2:{sutun2} , test_size={test_size} ,random_state={random_state} ve Hedef Etiketi y = df['page life expectancy'] {operator} {deger} değerleri bulunmaktadır, bu parametrelerin sonuçları da raporda detaylı bir şekilde açıklanmıştır."
    pdf.add_text(sample_text, " ",10,100)

    pdf.add_image('./img/heatmap.png', 'Isi Haritasi')
    pdf.add_text(f'{answer1}','',10,150)
    pdf.add_image('./img/heatmap2.png', 'Kolerasyon Matrisi')
    pdf.add_text(f'{answer2}','',10,150)
    pdf.add_image('./img/plot.png', 'Page Life Expectancy')
    pdf.add_text(f'{answer3}','',10,150)
    pdf.add_image('./img/pie_chart.png', 'Pasta Grafigi')
    pdf.add_text(f'{answer4}','',10,150)
    pdf.add_image('./img/orijinal_sinifdagilimi.png', 'Orijinal Sinif Dagilimi')
    pdf.add_text(f'{answer5}','',10,130)
    pdf.add_image('./img/undersampling_sinifdagilimi.png', 'Undersampling ve Oversampling Sinif Dagilimi')
    pdf.add_text(f'{answer6}','',10,105)
    pdf.add_image('./img/support_plot.png', 'Support Plot')
    pdf.add_text(f'{answer7}','',10,140)
    pdf.add_image('./img/confidence_plot.png', 'Confidence Plot')
    pdf.add_text(f'{answer8}','',10,140)

    pdf.add_image('./img/confusion_matrix_KNN.png', 'Confusion Matrix KNN')
    pdf.add_text(f'{answer}','',10,160)
    
    # PDF oluşturma
    pdf.output(output_pdf_path)
    print("Yeni KNN PDF dosyasi kaydedildi.")
    

    return jsonify(output_pdf_path), 200







####################################################################################

# @app.route('/register', methods=['POST'])
# def register():
#     try:
#         # Kullanici bilgilerini al
#         username = request.json['username']
#         email = request.json['email']
#         password = request.json['password']
#         role = request.json.get('role', 'user')

#         # E-posta adresiyle kayitli kullaniciyi kontrol et
#         existing_user = collection.find_one({'email': email})
#         if existing_user:
#             return jsonify({'error': 'Email adresi önceden kayitli!'}), 400

#         # Parolayi hashle
#         hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

#         # Yeni kullaniciyi oluştur ve veritabanina kaydet
#         new_user = {
#             'username': username,
#             'email': email,
#             'password': hashed_password,
#             'role': role,
#             'created_at': str(datetime.now()) # Oluşturma tarihini ekle
#         }
#         collection.insert_one(new_user)
#         print("kullanici eklendi")

#         # Oluşturulan kullaniciyi yanit olarak dön
#         return jsonify(new_user), 201

#     except KeyError as e:
#         return jsonify({'error': 'Missing required fields: {}'.format(str(e))}), 400

#     except Exception as e:
#         return jsonify({'error': str(e)}), 201
    

# @app.route("/login", methods=["POST"])
# def login():
#     try:
#         email = request.json.get("email")
#         password = request.json.get("password")

#         db = client['test']  # Replace with your database name
#         collection = db['users']  # Replace with your collection name

#         user = collection.find_one({"email": email})

#         if not user:
#             return jsonify({"error": "Invalid Email"}), 401

#         is_password_valid = bcrypt.check_password_hash(user["password"], password)

#         if not is_password_valid:
#             return jsonify({"error": "Invalid Password"}), 401

#         return jsonify({
#             "id": str(user["_id"]),
#             "email": user["email"],
#             "username": user["username"],
#             "role": user["role"]
#         }), 200

#     except Exception as e:
#         return jsonify({"error": "Server error."}), 500



import pyodbc
import uuid
from datetime import datetime

# MSSQL veritabanı bağlantı bilgileri
server = 'localhost\\SQLEXPRESS'  # Sunucu adı
database = 'DOC'  # Veritabanı adı

connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
cursor = connection.cursor()



@app.route('/register', methods=['POST'])
def register():
    try:
        # Kullanıcı bilgilerini al
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']
        role = data.get('role', 'user')

        # E-posta adresiyle kayıtlı kullanıcıyı kontrol et
        cursor.execute("SELECT * FROM UserTable WHERE Email = ?", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'error': 'Email adresi önceden kayıtlı!'}), 400

        # Parolayı hashle
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        
        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Yeni kullanıcıyı oluştur ve veritabanına kaydet
        cursor.execute("INSERT INTO UserTable (UserID, UserName, Email, Password, Role, CreateDate) VALUES (?, ?, ?, ?, ?, ?)",
                    (str(uuid.uuid4()), username, email, hashed_password, role, created_at))
        connection.commit()


        new_user = {
            'username': username,
            'email': email,
            'role': role,
            'created_at': created_at
        }

        return jsonify(new_user), 201

    except KeyError as e:
        return jsonify({'error': 'Missing required fields: {}'.format(str(e))}), 400

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

import pyodbc
import uuid
from datetime import datetime

# MSSQL veritabanı bağlantı bilgileri
server = 'localhost\\SQLEXPRESS'  # Sunucu adı
database = 'DOC'  # Veritabanı adı
@app.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")

         # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı sorgusu
        cursor.execute("SELECT * FROM UserTable WHERE Email = ?", email)
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid Email"}), 401

        is_password_valid = bcrypt.check_password_hash(user.Password, password)

        if not is_password_valid:
            return jsonify({"error": "Invalid Password"}), 401

        return jsonify({
            "id": str(user.UserID),
            "email": user.Email,
            "username": user.UserName,
            "role": user.Role
        }), 200

    except Exception as e:
        return jsonify({"error": "Server error."}), 500

# Veri setini yükleme
df = pd.read_csv(yuklenen_dosya_path)

# 'page life expectancy' değerini kategorilere ayirma
def categorize_page_life_expectancy(value):
    if value < 301:
        return 'Dusuk'
    elif 301 <= value < 5000:
        return 'Orta'
    else:
        return 'Yuksek'

# Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

# Her bir satir için 'alişveriş sepeti' oluşturma
transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()

# Veri setini FP-Growth için uygun formata dönüştürme
te = TransactionEncoder()
te_ary = te.fit(transactions).transform(transactions)
df_ready_for_fp = pd.DataFrame(te_ary, columns=te.columns_)

# FP-Growth algoritmasini kullanarak sik kullanilan item setlerini bulma
frequent_itemsets = fpgrowth(df_ready_for_fp, min_support=0.1, use_colnames=True)

# Kurallari çikarma
rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)
grouped = df.groupby(['InstanceID', 'page_life_category']).size().unstack(fill_value=0)



# Grafiği oluşturma ve kaydetme
plt.figure(figsize=(10, 8))
sns.heatmap(grouped, annot=True, fmt="d", cmap="YlGnBu")
plt.title('Page Life Expectancy Kategorilerine Göre Isi Haritasi')
plt.xlabel('Page Life Kategorisi')
plt.ylabel('InstanceID')
plt.savefig('./img/heatmap.png')
plt.close()



@app.route('/get_heatmap')
def get_heatmap():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    print(grouped)
    text= grouped
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f""" veri setindeki ilişkileri ve kategoriler arasındaki örüntüleri analiz etmek için bu {text} değerleri elde ettim. Bu değerlere göre
                :\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)

    return send_file('./img/heatmap.png', mimetype='image/png')

################################-------------GPT-------YORUM-------#########################################
@app.route('/get_heatmap_gpt_yorum', methods=['GET', 'POST'])
def get_heatmap_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    print(grouped)
    text = grouped
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f""" veri setindeki ilişkileri ve kategoriler arasındaki örüntüleri analiz etmek için bu {text} değerleri elde ettim. Bu değerlere göre
                :\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})

@app.route('/get_heatmap2_gpt_yorum', methods=['GET', 'POST'])
def get_heatmap2_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin

    veriler = pd.read_csv(yuklenen_dosya_path)
    veriler_h = veriler.head()
    
    X = veriler.iloc[:, 2:36].values
    Y = veriler.iloc[:, 2:7]
    Z = veriler.iloc[:, 7:36]

    korelasyon_matrisi = Y.corr()

    print(korelasyon_matrisi)
    text= korelasyon_matrisi

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""veri setindeki belirli sütunlar arasındaki korelasyonu görselleştirmek için bu {text} değerleri elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})


@app.route('/get_expectancy_gpt_yorum', methods=['GET', 'POST'])
def get_expectancy_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' kolonunu etiketleme
    df['page_life_expectancy_etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Altinci indeksten son indekse kadar olan sütunlar
    altinci_sutundan_sonra = df.columns[6:]  # Altinci indeksten itibaren sütun isimlerini al

    # İlişkileri saklamak için boş bir DataFrame oluştur
    iliskiler_df = pd.DataFrame(columns=['Sütun', '1 için Ortalama', '0 için Ortalama'])

    for sutun in altinci_sutundan_sonra:
        # 1 ve 0 değerlerinin ortalamalarini hesapla
        bir_ortalama = df[df[sutun] == 1]['page_life_expectancy_etiket'].mean()
        sifir_ortalama = df[df[sutun] == 0]['page_life_expectancy_etiket'].mean()

        # Yeni verileri DataFrame'e ekle
        if not pd.isna(bir_ortalama) and bir_ortalama != 0:
            yeni_satir = pd.DataFrame({'Sütun': [sutun], '1 için Ortalama': [bir_ortalama], '0 için Ortalama': [sifir_ortalama]})
            iliskiler_df = pd.concat([iliskiler_df, yeni_satir], ignore_index=True)

    print(iliskiler_df)
    text= iliskiler_df

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""veri setindeki belirli sütunların 'page life expectancy' sütunu üzerindeki etkilerini incelemek için kullanılmış bu {text} değerleri elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})


@app.route('/get_piechart_gpt_yorum', methods=['GET', 'POST'])
def get_piechart_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' değerini kategorilere ayirma
    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Kategori frekanslarini hesaplama
    labels = df['page_life_category'].value_counts()
    w = (list(labels.index), list(labels.values))


    print(w)
    text= w

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""veri setindeki page life expectancy değerlerini kategorilere ayırarak bu kategorilerin gözlem sayılarını pasta grafiği ile görselleştirmektedir. buna istinaden {text} değerleri elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})

@app.route('/get_get_orijinal_sinifdagilimi_gpt_yorum', methods=['GET', 'POST'])
def get_get_orijinal_sinifdagilimi_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' kolonunu etiketleme
    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    data=df['etiket'].value_counts()
    print("Sınıf dağılımı:\n", data)
    text= data

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f""" veri setindeki page life expectancy değerlerine göre bir etiketleme yapar, bu etiketlemeyi görselleştirir ve sonrasında veri seti hakkında bilgi verir. buna istinaden {text} değerleri elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})


@app.route('/get_get_undersampling_sinifdagilimi_gpt_yorum', methods=['GET', 'POST'])
def get_get_undersampling_sinifdagilimi_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' kolonunu etiketleme
    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Azınlık ve çoğunluk sınıflarını ayır
    df_majority = df[df['etiket'] == 0]
    df_minority = df[df['etiket'] == 1]

    # Azınlık sınıfını çoğaltma (Oversampling)
    df_minority_upsampled = resample(df_minority, replace=True, n_samples=len(df_majority), random_state=123)
    df_upsampled = pd.concat([df_majority, df_minority_upsampled])

    # Çoğunluk sınıfını azaltma (Undersampling)
    df_majority_downsampled = resample(df_majority, replace=False, n_samples=len(df_minority), random_state=123)
    df_downsampled = pd.concat([df_majority_downsampled, df_minority])

    data1=df_upsampled['etiket'].value_counts()
    data2=df_downsampled['etiket'].value_counts()
    print("Sınıf dağılımı:\n", df_upsampled['etiket'].value_counts())
    print("Sınıf dağılımı:\n", df_downsampled['etiket'].value_counts())
    
    text1 = data1
    text2 = data2

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""dengesiz sınıf dağılımı (class imbalance) sorununu ele almak için kullanılan örnekleme (sampling) tekniklerini içerir, burada Oversampling Yapıldıktan Sonra {text1} değerleri elde ettim ve Undersampling Yapıldıktan Sonra {text2} değerleri elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})



@app.route('/get_get_support_plot_gpt_yorum', methods=['GET', 'POST'])
def get_get_support_plot_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

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

    print(frequent_itemsets)
    data1= frequent_itemsets
    text1 = data1

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""veri setindeki öğe kümelerinin sık görülen kombinasyonlarını FP-Growth algoritması kullanarak bulmayı amaçlar, buna istinaden {text1} değerlerini elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})



@app.route('/get_get_confidence_plot_gpt_yorum', methods=['GET', 'POST'])
def get_get_confidence_plot_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

        
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
    print(rules)
    data1=rules
    text1 = data1

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""veri setini işleyerek FP-Growth algoritması kullanılarak sık kullanılan item setlerini bulmayı ve bu item setleri üzerinden kurallar çıkarmayı amaçlar, buna istinaden {text1} değerlerini elde ettim. Bu değerlere göre
                :\n\n\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})



@app.route('/get_heatmap2')
def get_heatmap2():
    veriler = pd.read_csv(yuklenen_dosya_path)
    veriler_h = veriler.head()
    
    X = veriler.iloc[:, 2:36].values
    Y = veriler.iloc[:, 2:7]
    Z = veriler.iloc[:, 7:36]

    korelasyon_matrisi = Y.corr()

    plt.figure(figsize=(10, 8))
    sns.heatmap(korelasyon_matrisi, annot=True, fmt=".2f", cmap='coolwarm')

    # Grafiği ./img dosyasina kaydetme
    plt.savefig('./img/heatmap2.png')
    plt.close()

    return send_file('./img/heatmap2.png', mimetype='image/png')



@app.route('/get_istatistikler')
def get_statistics():
    dosya_yolu = pd.read_csv(yuklenen_dosya_path)
    df = dosya_yolu
    df = df.iloc[:, 2:8]
    
    # İstatistiksel özetleri saklamak için boş bir DataFrame oluştur
    istatistikler = pd.DataFrame(columns=['Özellik', 'Mod', 'Medyan', 'Standart Sapma', 'Ortalama', 'Minimum', 'Maksimum'])

    for kolon in df.columns:
        # Mod hesaplama (birden fazla mod olabilir)
        mod = df[kolon].mode().values

        # Eğer birden fazla mod değeri varsa, bunlari birleştir
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

    # İstatistiksel özetleri JSON formatina dönüştürerek döndür
    return jsonify(istatistikler.to_dict(orient='records'))


@app.route('/generate_and_send_plot')
def generate_and_send_plot():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' kolonunu etiketleme
    df['page_life_expectancy_etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Altinci indeksten son indekse kadar olan sütunlar
    altinci_sutundan_sonra = df.columns[6:]  # Altinci indeksten itibaren sütun isimlerini al

    # İlişkileri saklamak için boş bir DataFrame oluştur
    iliskiler_df = pd.DataFrame(columns=['Sütun', '1 için Ortalama', '0 için Ortalama'])

    for sutun in altinci_sutundan_sonra:
        # 1 ve 0 değerlerinin ortalamalarini hesapla
        bir_ortalama = df[df[sutun] == 1]['page_life_expectancy_etiket'].mean()
        sifir_ortalama = df[df[sutun] == 0]['page_life_expectancy_etiket'].mean()

        # Yeni verileri DataFrame'e ekle
        if not pd.isna(bir_ortalama) and bir_ortalama != 0:
            yeni_satir = pd.DataFrame({'Sütun': [sutun], '1 için Ortalama': [bir_ortalama], '0 için Ortalama': [sifir_ortalama]})
            iliskiler_df = pd.concat([iliskiler_df, yeni_satir], ignore_index=True)

    

    # Grafik boyutunu ayarla
    fig, ax = plt.subplots(figsize=(12, 8))

    # Her bir sütun için, 1 ve 0 değerlerinin ortalamalarini bar grafik olarak çizdir
    bar_genisligi = 0.35
    index = range(len(iliskiler_df))

    ax.bar(index, iliskiler_df['1 için Ortalama'], bar_genisligi, label='1 için Ortalama', color='blue')
    ax.bar([p + bar_genisligi for p in index], iliskiler_df['0 için Ortalama'], bar_genisligi, label='0 için Ortalama', color='red')

    # Grafik başliği ve eksen etiketlerini ekle
    ax.set_xlabel('Kolonlar')
    ax.set_ylabel('Ortalama Etiket Değeri')
    ax.set_title('Diğer Kolon Değerlerinin "Page Life Expectancy" Üzerindeki Etkisi')
    ax.set_xticks([p + bar_genisligi/2 for p in index])
    ax.set_xticklabels(iliskiler_df['Sütun'], rotation=90)

    # Efsaneyi ekle
    ax.legend()

    # Görüntüyü kaydet
    plt.savefig('./img/plot.png')
    
    

    # Görüntüyü React tarafina gönder
    return send_file('./img/plot.png', mimetype='image/png')


@app.route('/get_relationships')
def get_relationships():
    df = pd.read_csv(yuklenen_dosya_path)
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
    df = pd.read_csv(yuklenen_dosya_path)
    data = df.head(5)
    columns = data.columns.tolist()
    rows = data.values.tolist()
    return jsonify(columns, rows)


@app.route('/get_fulldata')
def get_fulldata():
    df = pd.read_csv(yuklenen_dosya_path)
    columns = df.columns.tolist()
    rows = df.values.tolist()
    return jsonify(columns, rows)


@app.route('/get_dataframe_summary')
def get_dataframe_summary():
    df = pd.read_csv(yuklenen_dosya_path)
    summary_dict = df.describe().T.to_dict(orient='records')
    return jsonify(summary_dict)

@app.route('/get_pie_chart')
def get_pie_chart():
    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' değerini kategorilere ayirma
    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Kategori frekanslarini hesaplama
    labels = df['page_life_category'].value_counts()
    w = (list(labels.index), list(labels.values))

    # Pasta grafiği için explode ayarlari
    explode = [0, 0, 0.1]  # Yüksek kategorisini biraz öne çikar

    # Pasta grafiği çizme
    fig = plt.figure(figsize=(7, 5))
    plt.pie(w[1], explode=explode, labels=w[0], shadow=True, startangle=90,
            colors=['red', 'green', 'blue'], autopct='%1.1f%%', textprops={'fontsize': 15})
    plt.axis('equal')  # Bu sayede pasta grafiği yuvarlak görünür
    plt.legend(title='[page life expectancy] değerleri', loc='upper left')

    # Grafik dosyasini kaydetme
    fig.savefig('./img/pie_chart.png')
    
    return send_file('./img/pie_chart.png', mimetype='image/png')


def preprocess_data():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    # 'page life expectancy' kolonunu etiketleme
    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)

    # Orijinal sinif dağilimini görselleştirme ve kaydetme
    plt.figure(figsize=(8, 4))
    df['etiket'].value_counts().plot(kind='bar', color=['blue', 'red'])
    plt.title('Orijinal Sinif Dağilimi')
    plt.xlabel('Etiket')
    plt.ylabel('Frekans')
    plt.xticks([0, 1], ['page life expectancy (>300)', 'page life expectancy (0-300)'], rotation=0)
    plt.savefig('./img/orijinal_sinifdagilimi.png')

    # Azinlik ve çoğunluk siniflarini ayir
    df_majority = df[df['etiket'] == 0]
    df_minority = df[df['etiket'] == 1]

    # Azinlik sinifini çoğaltma (Oversampling)
    df_minority_upsampled = resample(df_minority, replace=True, n_samples=len(df_majority), random_state=123)
    df_upsampled = pd.concat([df_majority, df_minority_upsampled])

    # Çoğunluk sinifini azaltma (Undersampling)
    df_majority_downsampled = resample(df_majority, replace=False, n_samples=len(df_minority), random_state=123)
    df_downsampled = pd.concat([df_majority_downsampled, df_minority])

    # Güncellenmiş sinif dağilimlarini görselleştirme ve kaydetme
    fig, ax = plt.subplots(1, 2, figsize=(14, 5), sharey=True)
    df_upsampled['etiket'].value_counts().plot(kind='bar', ax=ax[0], color=['blue', 'red'])
    ax[0].set_title('Oversampling Sonrasi Sinif Dağilimi')
    ax[0].set_xlabel('Etiket')
    ax[0].set_ylabel('Frekans')
    ax[0].set_xticklabels(['page life expectancy (>300)', 'page life expectancy (0-300)'], rotation=0)

    df_downsampled['etiket'].value_counts().plot(kind='bar', ax=ax[1], color=['blue', 'red'])
    ax[1].set_title('Undersampling Sonrasi Sinif Dağilimi')
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

from flask import jsonify
@app.route('/get_svm_performance', methods=['POST'])
def get_svm_performance():
    form_data = request.json
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin

    # Form verilerinden çekirdek ve C değerlerini alin
    kernel = form_data.get('kernel')
    C = form_data.get('C')
    test_size = form_data.get('test_size')
    random_state = form_data.get('random_state')
    sutun1 = int(form_data.get('sutun1')['value'])
    sutun2 = int(form_data.get('sutun2')['value'])
    deger = form_data.get('deger')
    operator = form_data.get('operator')


    if kernel is None or C is None:
        return jsonify({'error': 'Eksik veri. Çekirdek ve C değeri gereklidir.'}), 400

    df = pd.read_csv(yuklenen_dosya_path)
    X = df.iloc[:, sutun1: sutun2]  # 2 ila 6 arasindaki sütunlar artik dinamik
    # y = df['page life expectancy'] > deger  # Hedef etiket

    # Verileri filtrele
    if operator == '>':
        y = df['page life expectancy'] > deger
    elif operator == '<':
        y = df['page life expectancy'] < deger
    elif operator == '<=':
        y = df['page life expectancy'] <= deger
    elif operator == '>=':
        y = df['page life expectancy'] >= deger
    else:
        return "Geçersiz operatör"

    # Veriyi eğitim ve test kümelerine bölelim
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = test_size, random_state = random_state)

    # SVM modelini oluştur
    svm_model = SVC(kernel=kernel, C=C)
    svm_model.fit(X_train, y_train)

    # Test verilerini tahmin et
    y_pred = svm_model.predict(X_test)

    # Model performansini değerlendir
    conf_matrix = confusion_matrix(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    conf_matrix_str = str(conf_matrix)
    recall_str = str(recall)
    accuracy_str = str(accuracy)
    f1_str = str(f1)
    report_str = str(report)

    text = f"Confusion Matrix:\n{conf_matrix_str}\nRecall: {recall_str}\nAccuracy: {accuracy_str}\nF1 Score: {f1_str}\nClassification Report:\n{report_str}"

    algorithm = "SVM"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""Bir {algorithm} makine algoritması gerçekleştirdim. Bu metod kullanıldıktan sonra 
                sonuçlarım şu şekildedir:\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Çalışan algoritma: {algorithm}
                Chat-GPT tarafından üretilen analiz: 'senin analizin'

                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)


    result = {
        'confusion_matrix': conf_matrix.tolist(),
        'recall': recall,
        'accuracy': accuracy,
        'f1': f1,
        'classification_report': classification_report(y_test, y_pred, output_dict=True),
        'answer': answer,
        'c':C,
        'kernel':kernel,
        'sutun1':sutun1,
        'sutun2':sutun2,
        'test_size':test_size,
        'random_state':random_state,
        'deger':deger,
        'operator':operator,
    }

    return jsonify(result)


@app.route('/get_RF_performance', methods=['POST'])
def get_RF_performance():
    form_data = request.json

    # React formundan gelen parametreleri alinmasi
    n_estimators = form_data.get("n_estimators")
    max_depth = form_data.get("max_depth")
    min_samples_split = form_data.get("min_samples_split")
    criterion = form_data.get("criterion")
    random_state = form_data.get("random_state")
    test_size = form_data.get("test_size")

    
    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Her bir satir için 'alişveriş sepeti' oluşturma
    transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()
    df.drop(columns=['InstanceID', 'CreateDate'], inplace=True)

    # Kategorik değişkenleri sayisallaştirma
    label_encoder = LabelEncoder()
    df['page_life_category'] = label_encoder.fit_transform(df['page_life_category'])

    # Bağimsiz değişkenler (X) ve bağimli değişken (y)
    X = df.drop('page_life_category', axis=1)
    y = df['page_life_category']

    # Eğitim ve test veri setlerine ayirma
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)

    if n_estimators is None or max_depth is None or min_samples_split is None or criterion is None:
        return jsonify({'error': 'One or more parameters are missing.'}), 400

    n_estimators = int(n_estimators)
    max_depth = int(max_depth)
    min_samples_split = int(min_samples_split)

    # Random Forest modelini oluşturma ve eğitme
    rf_model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, min_samples_split=min_samples_split,
                                       criterion=criterion, random_state=random_state)
    rf_model.fit(X_train, y_train)

    # Modelin test verileri üzerinde tahmin yapma
    y_pred = rf_model.predict(X_test)

    # Modelin başarisini değerlendirme
    accuracy = accuracy_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred, average='micro')  # 'macro' olarak ayarla
    f1 = f1_score(y_test, y_pred, average='micro')  # 'macro' olarak ayarla
    conf_matrix = confusion_matrix(y_test, y_pred)
    class_report = classification_report(y_pred,y_test, output_dict=True)  # classification report'u dict olarak al
    report = classification_report(y_test, y_pred, output_dict=True)

    conf_matrix_str = str(conf_matrix)
    recall_str = str(recall)
    accuracy_str = str(accuracy)
    f1_str = str(f1)
    report_str = str(report)

    text = f"Confusion Matrix:\n{conf_matrix_str}\nRecall: {recall_str}\nAccuracy: {accuracy_str}\nF1 Score: {f1_str}\nClassification Report:\n{report_str}"

    algorithm = "Random Forest"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""Bir {algorithm} makine algoritması gerçekleştirdim. Bu metod kullanıldıktan sonra 
                sonuçlarım şu şekildedir:\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Çalışan algoritma: {algorithm}
                Chat-GPT tarafından üretilen analiz: 'senin analizin'

                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)


    # result nesnesini oluşturun
    result = {
        'confusion_matrix': conf_matrix.tolist(),
        'recall': recall,
        'accuracy': accuracy,
        'f1': f1,
        'classification_report': report,  # classification report'u ekle
        'answer': answer ,
        'n_estimators':n_estimators,
        'max_depth':max_depth,
        'min_samples_split':min_samples_split,
        'criterion':criterion,
        'random_state':random_state,
        'test_size':test_size,
    }
    return jsonify(result)
    

@app.route('/get_RF_performance_classification', methods=['POST'])
def get_RF_performance_classification():
    form_data = request.json

    # React formundan gelen parametreleri alinmasi
    n_estimators = form_data.get("n_estimators")
    max_depth = form_data.get("max_depth")
    min_samples_split = form_data.get("min_samples_split")
    criterion = form_data.get("criterion")
    
    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Her bir satir için 'alişveriş sepeti' oluşturma
    transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()
    df.drop(columns=['InstanceID', 'CreateDate'], inplace=True)

    # Kategorik değişkenleri sayisallaştirma
    label_encoder = LabelEncoder()
    df['page_life_category'] = label_encoder.fit_transform(df['page_life_category'])

    # Bağimsiz değişkenler (X) ve bağimli değişken (y)
    X = df.drop('page_life_category', axis=1)
    y = df['page_life_category']

    # Eğitim ve test veri setlerine ayirma
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    if n_estimators is None or max_depth is None or min_samples_split is None or criterion is None:
        return jsonify({'error': 'One or more parameters are missing.'}), 400

    n_estimators = int(n_estimators)
    max_depth = int(max_depth)
    min_samples_split = int(min_samples_split)

    # Random Forest modelini oluşturma ve eğitme
    rf_model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, min_samples_split=min_samples_split,
                                       criterion=criterion, random_state=42)
    rf_model.fit(X_train, y_train)

    # Modelin test verileri üzerinde tahmin yapma
    y_pred = rf_model.predict(X_test)

    print(classification_report(y_pred,y_test))


@app.route('/get_KNN_performance', methods=['POST'])
def get_KNN_performance():
    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)
    form_data = request.json

    n_neighbors = form_data.get('n_neighbors')
    metric = form_data.get('metric')
    weights = form_data.get('weights')
    test_size = form_data.get('test_size')
    random_state = form_data.get('random_state')
    sutun1 = int(form_data.get('sutun1')['value'])
    sutun2 = int(form_data.get('sutun2')['value'])
    deger = form_data.get('deger')
    operator = form_data.get('operator')

    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)
    
    label_counts = df['etiket'].value_counts()
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_sifira_gore = resample(df_majority,
                              replace=False,
                              n_samples=label_counts.min(),  # azinlik sinifinin büyüklüğüne eşitlenir
                              random_state= random_state)
    df_sifira_gore = pd.concat([df_sifira_gore, df_minority])

    X = df_sifira_gore.iloc[:, sutun1: sutun2]  # 2 ila 6 arasindaki sütunlar artik dinamik
    # y = df['page life expectancy'] > deger  # Hedef etiket

    # Verileri filtrele
    if operator == '>':
        y = df_sifira_gore['page life expectancy'] > deger
    elif operator == '<':
        y = df_sifira_gore['page life expectancy'] < deger
    elif operator == '<=':
        y = df_sifira_gore['page life expectancy'] <= deger
    elif operator == '>=':
        y = df_sifira_gore['page life expectancy'] >= deger
    else:
        return "Geçersiz operatör"

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    
    knn = KNeighborsClassifier(n_neighbors=n_neighbors, metric=metric, weights=weights)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    
    conf_matrix = confusion_matrix(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    conf_matrix_str = str(conf_matrix)
    recall_str = str(recall)
    accuracy_str = str(accuracy)
    f1_str = str(f1)
    report_str = str(report)

    text = f"Confusion Matrix:\n{conf_matrix_str}\nRecall: {recall_str}\nAccuracy: {accuracy_str}\nF1 Score: {f1_str}\nClassification Report:\n{report_str}"

    algorithm = "KNN"

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""Bir {algorithm} makine algoritması gerçekleştirdim. Bu metod kullanıldıktan sonra 
                sonuçlarım şu şekildedir:\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Çalışan algoritma: {algorithm}
                Chat-GPT tarafından üretilen analiz: 'senin analizin'

                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)

    
    result = {
        'confusion_matrix': conf_matrix.tolist(),
        'recall': recall,
        'accuracy': accuracy,
        'f1': f1,
        'classification_report': classification_report(y_test, y_pred, output_dict=True),
        'answer':answer,
        'n_neighbors':n_neighbors,
        'metric':metric,
        'weights':weights,
        'sutun1':sutun1,
        'sutun2':sutun2,
        'test_size':test_size,
        'random_state':random_state,
        'deger':deger,
        'operator':operator,
    }

    return jsonify(result)


@app.route('/get_confusion_matrix_SVM', methods=['POST'])
def get_confusion_matrix():
    data = request.json
    C = data['C']
    kernel = data['kernel']

    df = pd.read_csv(yuklenen_dosya_path)
    X = df.iloc[:, 2:7]  # 2 ila 6 arasindaki sütunlar
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

@app.route('/get_confusion_matrix_RF', methods=['POST'])
def get_confusion_matrix_RF():
    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)
    form_data = request.json
    

    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    # Yeni bir sütun oluşturarak her bir örneği bu kategorilere göre etiketleme
    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    # Her bir satir için 'alişveriş sepeti' oluşturma
    transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()
    df.drop(columns=['InstanceID', 'CreateDate'], inplace=True)

    # Kategorik değişkenleri sayisallaştirma
    label_encoder = LabelEncoder()
    df['page_life_category'] = label_encoder.fit_transform(df['page_life_category'])

    # Bağimsiz değişkenler (X) ve bağimli değişken (y)
    X = df.drop('page_life_category', axis=1)
    y = df['page_life_category']

    # Eğitim ve test veri setlerine ayirma
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # React formundan gelen parametreleri alinmasi
    n_estimators = form_data.get("n_estimators")
    max_depth = form_data.get("max_depth")
    min_samples_split = form_data.get("min_samples_split")
    criterion = form_data.get("criterion")

    if n_estimators is None or max_depth is None or min_samples_split is None or criterion is None:
        return jsonify({'error': 'One or more parameters are missing.'}), 400

    n_estimators = int(n_estimators)
    max_depth = int(max_depth)
    min_samples_split = int(min_samples_split)

    # Random Forest modelini oluşturma ve eğitme
    rf_model = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth, min_samples_split=min_samples_split,
                                       criterion=criterion, random_state=42)
    rf_model.fit(X_train, y_train)

    # Modelin test verileri üzerinde tahmin yapma
    y_pred = rf_model.predict(X_test)

    # Confusion matrix'i oluştur
    cm = confusion_matrix(y_test, y_pred)

    # Confusion matrix'i görselleştir
    plt.figure(figsize=(4, 4))
    sns.heatmap(cm, annot=True, linewidths=0.5, cmap='Blues', fmt='d')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.savefig('./img/confusion_matrix_RF.png')  # Confusion matrix görüntüsünü kaydet
    # pdf.add_image('./img/confusion_matrix_RF.png', 'confusion_matrix_RF')

    # Kaydedilen confusion matrix görüntüsünün yolunu döndür
    return send_file('./img/confusion_matrix_RF.png', mimetype='image/png')

@app.route('/get_confusion_matrix_KNN', methods=['POST'])
def get_confusion_matrix_KNN():
     # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)
    form_data = request.json

    df['etiket'] = df['page life expectancy'].apply(lambda x: 1 if x <= 300 else 0)
    
    label_counts = df['etiket'].value_counts()
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_majority = df[df['etiket'] == label_counts.idxmax()]
    df_minority = df[df['etiket'] == label_counts.idxmin()]
    df_sifira_gore = resample(df_majority,
                              replace=False,
                              n_samples=label_counts.min(),  # azinlik sinifinin büyüklüğüne eşitlenir
                              random_state=42)
    df_sifira_gore = pd.concat([df_sifira_gore, df_minority])
    X = df_sifira_gore.iloc[:, 2:]  # 2 ila 6 arasindaki sütunlar
    y = df_sifira_gore['page life expectancy'] > 300  # Hedef etiket
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=84)
    
    n_neighbors = form_data.get('n_neighbors')
    metric = form_data.get('metric')
    weights = form_data.get('weights')
    
    knn = KNeighborsClassifier(n_neighbors=n_neighbors, metric=metric, weights=weights)
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    
    # Confusion matrix'i oluştur
    cm = confusion_matrix(y_test, y_pred)
    print(cm)

    # Confusion matrix'i görselleştir
    plt.figure(figsize=(4, 4))
    sns.heatmap(cm, annot=True, linewidths=0.5, cmap='Blues', fmt='d')
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.savefig('./img/confusion_matrix_KNN.png')  # Confusion matrix görüntüsünü kaydet
    # pdf.add_image('./img/confusion_matrix_KNN.png', 'confusion_matrix_KNN')

    # Kaydedilen confusion matrix görüntüsünün yolunu döndür
    return send_file('./img/confusion_matrix_KNN.png', mimetype='image/png')

@app.route('/generate_plot_elbow')
def generate_plot_elbow():
    df = pd.read_csv(yuklenen_dosya_path)

    def categorize_page_life_expectancy(value):
        if value < 301:
            return 'Dusuk'
        elif 301 <= value < 5000:
            return 'Orta'
        else:
            return 'Yuksek'

    df['page_life_category'] = df['page life expectancy'].apply(categorize_page_life_expectancy)

    transactions = df.groupby(['InstanceID'])['page_life_category'].apply(list).tolist()
    df.drop(columns=['InstanceID', 'CreateDate'], inplace=True)

    label_encoder = LabelEncoder()
    df['page_life_category'] = label_encoder.fit_transform(df['page_life_category'])

    label_encoder = LabelEncoder()
    df['page_life_category'] = label_encoder.fit_transform(df['page_life_category'])

    scaler = StandardScaler()
    data_scaled = scaler.fit_transform(df)

    inertia = []
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i, random_state=42)
        kmeans.fit(data_scaled)
        inertia.append(kmeans.inertia_)

    plt.figure(figsize=(8, 4))
    plt.plot(range(1, 11), inertia, marker='o')
    plt.title('Elbow Method')
    plt.xlabel('Number of clusters')
    plt.ylabel('Inertia')
    plt.savefig('./img/elbow_plot.png')  # Grafiği kaydet
    # pdf.add_image('./img/elbow_plot.png', 'elbow_plot')
    plt.close()

    return send_file('./img/elbow_plot.png', mimetype='image/png')
   



@app.route('/get_support_plot')
def get_plots():
    # Veri setini yükleme
    df = pd.read_csv(yuklenen_dosya_path)

    # Sayisal değerleri kategorilere ayirma
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

    # İşlemleri oluşturma (her satir bir işlem)
    transactions = df[list(categories.keys())].apply(lambda x: x.dropna().tolist(), axis=1).tolist()

    # FP-Growth için uygun formata dönüştürme
    te = TransactionEncoder()
    te_ary = te.fit(transactions).transform(transactions)
    df_ready_for_fp = pd.DataFrame(te_ary, columns=te.columns_)

    # FP-Growth algoritmasini kullanarak sik kullanilan item setlerini bulma
    frequent_itemsets = fpgrowth(df_ready_for_fp, min_support=0.05, use_colnames=True)

    # Kurallari çikarma
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

    # Sik kullanilan öğe setlerinin destek değerlerini görselleştirme
    plt.figure(figsize=(10, 6))
    sns.barplot(data=frequent_itemsets, x='support', y=frequent_itemsets['itemsets'].astype(str))
    plt.title('Support of Frequent Itemsets')
    plt.xlabel('Support')
    plt.ylabel('Itemsets')
    plt.xticks(rotation=90)
    plt.tight_layout()
    support_plot_path = './img/support_plot.png'
    plt.savefig(support_plot_path)  # Ploti kaydet
    
    plt.close()

    # İlişkilendirme kurallarinin güven değerlerini görselleştirme
    plt.figure(figsize=(12, 8))
    sns.barplot(data=rules, x='confidence', y=rules['antecedents'].astype(str) + '=>' + rules['consequents'].astype(str))
    plt.title('Confidence of Association Rules')
    plt.xlabel('Confidence')
    plt.ylabel('Association Rules')
    plt.xticks(rotation=90)
    plt.tight_layout()
    confidence_plot_path = './img/confidence_plot.png'
    plt.savefig(confidence_plot_path)  # Ploti kaydet
    
    plt.close()
    return send_file('./img/support_plot.png', mimetype='image/png')


@app.route('/get_confidence_plot')
def get_confidence_plot():
    return send_file('./img/confidence_plot.png', mimetype='image/png')

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader

# PDF oluşturma fonksiyonu
def create_pdf(user_name):
    pdf_path = f'./pdfs/report_{user_name}.pdf'
    c = canvas.Canvas(pdf_path)
    c.drawString(100, 100, f"Report for {user_name}")
    c.save()
    return pdf_path

@app.route('/create_pdf', methods=['POST'])
def create_pdf_route():
    data = request.get_json()
    user_name = data.get('username')

    # PDF oluştur
    pdf_path = create_pdf(user_name)
    print("pdf username a gore olustu")

    return send_file(pdf_path, as_attachment=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file1' not in request.files:
        return "Dosya bulunamadı", 400

    file = request.files['file1']
    file.save(os.path.join('./', "model.csv"))
    
    return "Dosya başarıyla yüklendi", 200


@app.route('/upload1', methods=['POST'])
def upload1_file():
    if 'file1' not in request.files:
        return "Dosya bulunamadı", 400

    file = request.files['file1']
    file.save(os.path.join('./', "model1.csv"))
    
    return "Dosya başarıyla yüklendi", 200


@app.route('/upload2', methods=['POST'])
def upload2_file():
    if 'file2' not in request.files:
        return "Dosya bulunamadı", 400

    file = request.files['file2']
    file.save(os.path.join('./', "model2.csv"))
    
    return "Dosya başarıyla yüklendi", 200


@app.route('/merge_csv_files', methods=['POST'])
def merge_csv_files():
    # İlk CSV dosyasını oku
    df1 = pd.read_csv("./model1.csv")

    # İkinci CSV dosyasını oku
    df2 = pd.read_csv("./model2.csv")

    # İki dosyanın ilk satırlarını al ve string formatına dönüştür
    first_row1 = df1.iloc[0].to_string(index=False)
    first_row2 = df2.iloc[0].to_string(index=False)

    # İki dosyanın ilk satırlarını karşılaştır
    if first_row1 == first_row2:
        # İlk satırlar aynıysa ikinci dosyanın satırlarını birinci dosyanın altına ekle
        merged_df = pd.concat([df1, df2.iloc[1:]], ignore_index=True)
        
        # Birleştirilmiş veriyi yeni bir CSV dosyasına yaz
        merged_df.to_csv("./model.csv", index=False)
        print("Dosya başarıyla birleşti ve kaydedildi")
        return " ", 200
    
    else:
        print("İlk satırlar eşleşmiyor, dosyalar birleştirilemedi.")
        return "İlk satırlar eşleşmiyor, dosyalar birleştirilemedi.", 400
    


@app.route('/download_merge_2_csv', methods=['POST'])
def download_merge_2_csv():
    pdf_path = "./model.csv"
    return send_file(pdf_path, as_attachment=True)


@app.route('/download_kullanim_klavuzu', methods=['POST'])
def download_kullanim_klavuzu():
    pdf_path = "./Adimlar.pdf"
    return send_file(pdf_path, as_attachment=True)

@app.route('/download_kullanim_klavuzu_web', methods=['POST'])
def download_kullanim_klavuzu_web():
    pdf_path = "./webKullanımklavuz.pdf"
    return send_file(pdf_path, as_attachment=True)

@app.route('/download_csv_script', methods=['POST'])
def download_csv_script():
    pdf_path = "./pleV2.txt"
    return send_file(pdf_path, as_attachment=True)
    
    

@app.route('/download_kriter_sql', methods=['POST'])
def download_kriter_sql():
    pdf_path = "./kriter.sql"
    return send_file(pdf_path, as_attachment=True)

@app.route('/download_pdf', methods=['POST'])
def download_pdf():
    data = request.get_json()
    path = data.get('path')
    return send_file(path, as_attachment=True)

# MSSQL veritabanı bağlantı bilgileri
server = 'localhost\\SQLEXPRESS'  # Sunucu adı
database = 'DOC'  # Veritabanı adı

@app.route("/users_data_adminpage", methods=["POST"])
def users_data_adminpage():
    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı sorgusu
        cursor.execute("SELECT * FROM UserTable where Role='user' ")
        
        # Kullanıcı verilerini çek
        users = cursor.fetchall()

        user_data = []
        
        # Kullanıcı verilerini JSON formatına dönüştür
        for user in users:
            user_data.append({
                "UserID": user[0],
                "UserName": user[1],
                "Email": user[2],
                "Password": user[3],
                "Role": user[4],
                "CreateDate": user[5]
            })
        
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({"error": "Server error."}), 500

@app.route("/user_data_page", methods=["POST"])
def user_data_page():
    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()
        data = request.get_json()
        usernamee = data.get('username')

        # Kullanıcı sorgusu (Parametrelerle sorgu yapılması önerilir)
        cursor.execute("SELECT * FROM UserTable WHERE UserName = ?", usernamee)
        
        # Kullanıcı verilerini çek
        users = cursor.fetchall()

        user_data = []
        
        # Kullanıcı verilerini JSON formatına dönüştür
        for user in users:
            user_data.append({
                "UserID": user[0],
                "UserName": user[1],
                "Email": user[2],
                "Password": user[3],
                "Role": user[4],
                "CreateDate": user[5]
            })
        
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({"error": "Server error."}), 500

@app.route("/admins_data_adminpage", methods=["POST"])
def admins_data_adminpage():
    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı sorgusu
        cursor.execute("SELECT * FROM UserTable where Role='admin' ")
        
        # Kullanıcı verilerini çek
        users = cursor.fetchall()

        user_data = []
        
        # Kullanıcı verilerini JSON formatına dönüştür
        for user in users:
            user_data.append({
                "UserID": user[0],
                "UserName": user[1],
                "Email": user[2],
                "Password": user[3],
                "Role": user[4],
                "CreateDate": user[5]
            })
        
        return jsonify(user_data), 200

    except Exception as e:
        return jsonify({"error": "Server error."}), 500
    
@app.route("/add_reports_svm_data_adminpage", methods=["POST"])
def add_reports_svm_data_adminpage():
    try:
        print("add report fonksiyonu basladi")
        data = request.get_json()
        usernamee = data.get('username')
        outputPdfPath =data.get('outputPdfPath')
        print(usernamee)
        report = outputPdfPath

        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı bilgilerini UserTable'dan çekme
        cursor.execute("SELECT UserId, UserName, Role FROM UserTable WHERE UserName = ?", usernamee)
        user_data = cursor.fetchone()
        companyiddValue = data.get('companyiddValue')
        print("selectedValueeeeeeeeeeeeeeeeeeeeeeeeeeeereportttt",companyiddValue)
        companyid = companyiddValue
        modelname ="svm model"
        print("usertable dan veri alindi1111111")
        print(user_data)
        print("usertable dan veri alindi222222")


        if user_data:
            userid= user_data[0]
            username = user_data[1]
            role = user_data[2]

            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            cursor.execute("INSERT INTO UserLogTable (UserID, UserName, CompanyId, CreateDate, AIModelName, UserRole, Report) VALUES (?, ?, ?, ?, ?, ?, CONVERT(varbinary(max), ?))",
                (userid, username, companyid, created_at, modelname, role, report.encode('utf-8')))
            connection.commit()
            print("add report fonksiyonu ekleme yapildi")
            
            new_report = {
                'userid':userid,
                'username': username,
                'companyid' : companyid,
                'created_at': created_at,
                'AIModelName':modelname,
                'role': role,
                'report': report,
            }

            return jsonify(new_report), 201
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500
    
@app.route("/add_reports_rf_data_adminpage", methods=["POST"])
def add_reports_rf_data_adminpage():
    try:
        print("add report fonksiyonu basladi")
        data = request.get_json()
        usernamee = data.get('username')
        outputPdfPath =data.get('outputPdfPath')
        print(usernamee)
        report = outputPdfPath

        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı bilgilerini UserTable'dan çekme
        cursor.execute("SELECT UserId, UserName, Role FROM UserTable WHERE UserName = ?", usernamee)
        user_data = cursor.fetchone()
        companyiddValue = data.get('companyiddValue')
        companyid = companyiddValue
        print("companyyyyyyyyyy",companyid)
        modelname ="random forest model"
        print("usertable dan veri alindi1111111")
        print(user_data)
        print("usertable dan veri alindi222222")


        if user_data:
            userid= user_data[0]
            username = user_data[1]
            role = user_data[2]

            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            cursor.execute("INSERT INTO UserLogTable (UserID, UserName, CompanyId, CreateDate, AIModelName, UserRole, Report) VALUES (?, ?, ?, ?, ?, ?, CONVERT(varbinary(max), ?))",
                (userid, username, companyid, created_at, modelname, role, report.encode('utf-8')))
            connection.commit()
            print("add report fonksiyonu ekleme yapildi")
            
            new_report = {
                'userid':userid,
                'username': username,
                'companyid' : companyid,
                'created_at': created_at,
                'AIModelName':modelname,
                'role': role,
                'report': report,
            }

            return jsonify(new_report), 201
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500
@app.route("/add_reports_knn_data_adminpage", methods=["POST"])
def add_reports_knn_data_adminpage():
    try:
        print("add report fonksiyonu basladi")
        data = request.get_json()
        usernamee = data.get('username')
        outputPdfPath =data.get('outputPdfPath')
        print(usernamee)
        report = outputPdfPath

        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı bilgilerini UserTable'dan çekme
        cursor.execute("SELECT UserId, UserName, Role FROM UserTable WHERE UserName = ?", usernamee)
        user_data = cursor.fetchone()
        companyiddValue = data.get('companyiddValue')
        companyid = companyiddValue
        modelname ="knn model"
        print("usertable dan veri alindi1111111")
        print(user_data)
        print("usertable dan veri alindi222222")


        if user_data:
            userid= user_data[0]
            username = user_data[1]
            role = user_data[2]

            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            cursor.execute("INSERT INTO UserLogTable (UserID, UserName, CompanyId, CreateDate, AIModelName, UserRole, Report) VALUES (?, ?, ?, ?, ?, ?, CONVERT(varbinary(max), ?))",
                (userid, username, companyid, created_at, modelname, role, report.encode('utf-8')))
            connection.commit()
            print("add report fonksiyonu ekleme yapildi")
            
            new_report = {
                'userid':userid,
                'username': username,
                'companyid' : companyid,
                'created_at': created_at,
                'AIModelName':modelname,
                'role': role,
                'report': report,
            }

            return jsonify(new_report), 201
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500
    
    


import base64
@app.route("/reports_data_adminpage", methods=["POST"])
def reports_data_adminpage():
    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı sorgusu
        cursor.execute("SELECT * FROM UserLogTable ORDER BY CreateDate DESC")
        
        # Kullanıcı verilerini çek
        reports = cursor.fetchall()

        report_data = []
        
        # Kullanıcı verilerini JSON formatına dönüştür
        for report in reports:
            # `bytes` türündeki veriyi base64 ile stringe çevir
           
            
            
            report_data.append({
                "UserID": report[0],
                "UserName": report[1],
                "CompanyId": report[2],
                "CreateDate": report[3],
                "AIModelName": report[4],
                "UserRole": report[5],
                "Report": report[6].decode('utf-8') if isinstance(report[6], bytes) else report[6]  
            })
        
        return jsonify(report_data), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500

@app.route("/company_data_adminpage", methods=["POST"])
def company_data_adminpage():
    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı sorgusu
        cursor.execute("SELECT * FROM CompanyTable ")
        
        # Kullanıcı verilerini çek
        companies = cursor.fetchall()

        company_data = []
        
        # Kullanıcı verilerini JSON formatına dönüştür
        for company in companies:
            company_data.append({
                "CompanyId": company[0],
                "CompanyName": company[1],
            })
        
        return jsonify(company_data), 200

    except Exception as e:
        return jsonify({"error": "Server error."}), 500
    


##########################----------------------LSTM--Model---------------------############################

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout

tf.random.set_seed(7) # Random'luğu ayarlama

# Uyarıları kapat
import warnings
warnings.filterwarnings('ignore')


@app.route('/Lstm_pagelife_img')
def Lstm_pagelife_img():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    plt.figure(figsize=(12, 6))
    plt.plot(df_lstm["page life expectancy"], color="b")
    plt.ylabel("Values", fontsize=12)
    plt.xlabel("Time", fontsize=12)
    plt.title("Page Life Expectancy", fontsize=14)

    plt.xticks(np.arange(0, len(df_lstm), 13990), fontsize=10)
    plt.yticks(fontsize=10)

    plt.grid(axis='x', linestyle='--', alpha=0.7)
    plt.show()

    # Görüntüyü kaydet
    plt.savefig('./img/Lstm_pagelife_img.png')
    

    # Görüntüyü React tarafina gönder
    return send_file('./img/Lstm_pagelife_img.png', mimetype='image/png')

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
@app.route('/Lstm_pagelife2_img',methods=['GET', 'POST'])
def Lstm_pagelife2_img():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)
    form_data = request.json

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    # Train - Test ayırma
    position = int(len(df_lstm) * 0.80)
    train, test = df_lstm.iloc[:position], df_lstm.iloc[position:]

    print("Train boyutu:", len(train), "Test boyutu:", len(test))
    # Standardizasyon işlemi

    scaler = MinMaxScaler()

    train_scaled = scaler.fit_transform(train)
    test_scaled = scaler.transform(test)

    def create_features(data, lookback=1):
        X, Y = [], []
        for i in range(lookback, len(data)):
            X.append(data[i-lookback : i,:])
            Y.append(data[i,0])
        return np.array(X), np.array(Y)
    # Features ve target olarak ayırma (X - y)
    lookback = 240 # son bir saat
    X_train, y_train = create_features(train_scaled, lookback)
    X_test, y_test = create_features(test_scaled, lookback)

    print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)                               # (55733, 240, 5) (55733,) (13754, 240, 5) (13754,)

    y_train_shaped = y_train.reshape(-1, 1)
    y_test_shaped = y_test.reshape(-1, 1)

    print(X_train.shape, y_train_shaped.shape, X_test.shape, y_test_shaped.shape)     # (55733, 240, 5) (55733, 1) (13754, 240, 5) (13754, 1)
    # Model kurma

    noron = form_data.get('noron')
    dropout = form_data.get('dropout')
    epoch = form_data.get('epoch')
    batch = form_data.get('batch')
    optimizer = form_data.get('optimizer')
    lossfunc = form_data.get('lossfunc')
    

    model = Sequential()
    model.add(LSTM(noron, input_shape=(lookback, 5))) # lookback: 240
    model.add(Dropout(dropout))
    model.add(Dense(1))

    model.compile(loss=lossfunc, optimizer= optimizer)

    # Model eğitimi
    model.fit(X_train, y_train_shaped, epochs=epoch, batch_size=batch, verbose=2, shuffle=False);

    # Train ve test tahminleri
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    # Tahmin ve gerçek değerleri inverse_transform için uygun formata getirme
    train_predict_reshaped = np.concatenate((train_pred.reshape(-1, 1), np.zeros((train_pred.shape[0], 4))), axis=1)
    test_predict_reshaped = np.concatenate((test_pred.reshape(-1, 1), np.zeros((test_pred.shape[0], 4))), axis=1)

    y_train_reshaped = np.concatenate((y_train.reshape(-1, 1), np.zeros((y_train.shape[0], 4))), axis=1)
    y_test_reshaped = np.concatenate((y_test.reshape(-1, 1), np.zeros((y_test.shape[0], 4))), axis=1)


    # inverse_transform işlemi (sadece ilk sütunlar gerekli)
    train_predict = scaler.inverse_transform(train_predict_reshaped)[:, 0]
    test_predict = scaler.inverse_transform(test_predict_reshaped)[:, 0]
    train_y = scaler.inverse_transform(y_train_reshaped)[:, 0]
    test_y = scaler.inverse_transform(y_test_reshaped)[:, 0]

        # Ortalama Mutlak Hata (MAE) hesaplama
    def mean_absolute_errorr(y_true, y_pred):
        mae = np.mean(np.abs(y_true - y_pred))
        return mae

    # Ortalama Karesel Hata (MSE) hesaplama
    def mean_squared_errorr(y_true, y_pred):
        mse = np.mean((y_true - y_pred) ** 2)
        return mse

    # Kök Ortalama Karesel Hata (RMSE) hesaplama
    def root_mean_squared_errorr(y_true, y_pred):
        mse = mean_squared_errorr(y_true, y_pred)
        rmse = np.sqrt(mse)
        return rmse


    # MAE hata hesaplaması
    train_mae = mean_absolute_errorr(train_y, train_predict)
    print('Train MAE: %.2f' % (train_mae)) # Train MAE: 375.75
    test_mae = mean_absolute_errorr(test_y, test_predict)
    print('Test MAE: %.2f' % (test_mae)) # Test MAE: 358.04
    # MSE hata hesaplaması
    train_mse = root_mean_squared_errorr(train_y, train_predict)
    print('Train MSE: %.2f' % (train_mse)) # Train MSE: 633991.05
    test_mse = root_mean_squared_errorr(test_y, test_predict)
    print('Test MSE: %.2f' % (test_mse)) # Test MSE: 518864.51
    # RMSE hata hesaplaması
    train_rmse = np.sqrt(root_mean_squared_errorr(train_y, train_predict))
    print('Train RMSE: %.2f' % (train_rmse)) # Train RMSE: 796.24
    test_rmse = np.sqrt(root_mean_squared_errorr(test_y, test_predict))
    print('Test RMSE: %.2f' % (test_rmse)) # Test RMSE: 720.32


    # Gerçek ve tahmin değerler üzerinde MAPE hesaplama
    def calculate_mape(actual, forecast):
        if len(actual) != len(forecast):
            raise ValueError("Gerçek ve tahmin edilen değer listeleri aynı uzunlukta olmalıdır.")
        
        n = len(actual)
        total_error = 0
        for i in range(n):
            if actual[i] != 0:
                total_error += abs((actual[i] - forecast[i]) / actual[i])
            else:
                total_error += abs(forecast[i])  # Eğer gerçek değer sıfırsa, tahmini direkt olarak kullan

        mape = ((total_error / n) * 10 )
        return mape
    

    # R-kare hesaplama
    def calculate_r2(y_true, y_pred):
        return r2_score(y_true, y_pred)

    scaler = MinMaxScaler()
    train_y_scaled = scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
    test_y_scaled = scaler.transform(y_test.reshape(-1, 1)).flatten()

    train_predict_scaled = scaler.transform(train_pred.reshape(-1, 1)).flatten()
    test_predict_scaled = scaler.transform(test_pred.reshape(-1, 1)).flatten()

    train_mape_scaled = calculate_mape(train_y_scaled, train_predict_scaled)
    print('Train MAPE (scaled): %.2f' % train_mape_scaled)

    test_mape_scaled = calculate_mape(test_y_scaled, test_predict_scaled)
    print('Test MAPE (scaled): %.2f' % test_mape_scaled)


    # R-kare hesaplama
    train_r2 = calculate_r2(train_y, train_predict)
    print('Train R^2: %.2f' % train_r2) # Train R^2: 
    test_r2 = calculate_r2(test_y, test_predict)
    print('Test R^2: %.2f' % test_r2) # Test R^2: 


    error_values = [train_mae, test_mae, train_mse, test_mse, train_rmse,test_rmse,train_mape_scaled,test_mape_scaled,train_r2,test_r2]

    pd.DataFrame(train_y).describe().T # mean: 6461.885041  std: 6095.707229
    pd.DataFrame(test_y).describe().T # mean: 6322.386942  std: 5862.962638

    # Karşılaştırma dataframe'lerinin oluşturulması
    train_prediction_df = df_lstm[lookback:position]
    train_prediction_df["Predicted"] = train_predict
    test_prediction_df = df_lstm[lookback+position:]
    test_prediction_df["Predicted"] = test_predict
    train_prediction_df # 555733 rows × 6 columns
    test_prediction_df # 13754 rows × 6 columns

    # Görselleştirme

    plt.figure(figsize=(12, 6))
    plt.plot(df_lstm["page life expectancy"], color="b", label="Real Values")
    plt.plot(train_prediction_df.Predicted, color="r", label="Train predicted")
    plt.plot(test_prediction_df.Predicted, color="g", label="Test predicted")

    plt.legend(loc = "upper right")
    plt.xlabel("Time", fontsize=12)
    plt.ylabel("Values", fontsize=12)
    plt.title("Page Life Expectancy", fontsize=14)

    plt.xticks(np.arange(0, len(df_lstm), 13990), fontsize=10)
    plt.yticks(fontsize=10)

    plt.grid(axis='x', linestyle='--', alpha=0.7)
    plt.show()

    # Görüntüyü kaydet
    plt.savefig('./img/Lstm_pagelife2_img.png')

    text1 = df_lstm
    text2 = train_prediction_df
    text3 = test_prediction_df
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""kod sonucunda "Page Life Expectancy" değerlerine ait real değerlerin {text1} ve train değerlerin {text2} ve test değerlerin {text3} olarak elde ettim ,görselleştirmek için matplotlib kütüphanesini kullanarak ortak bir çizgi grafiği oluşturur. Bu değerlere göre
                Birincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    
    # Örnek olarak response.choices[0].message.content'ten cevabı alıyoruz
    answer = response.choices[0].message.content
    result ={
        "answer": answer ,
        "noron" : noron ,
        "dropout" : dropout ,
        "epoch" : epoch ,
        "batch" : batch ,
        "optimizer" : optimizer ,
        "lossfunc" : lossfunc ,
        "error_values":error_values
    }

    return jsonify(result)



@app.route('/Lstm_pagelife2_img_path',methods=['GET'])
def Lstm_pagelife2_img_path():
    # Görüntüyü React tarafina gönder
    return send_file('./img/Lstm_pagelife2_img.png', mimetype='image/png')


@app.route('/Lstm_pagelife_img_gpt_yorum', methods=['GET', 'POST'])
def Lstm_pagelife_img_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin


    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    print(df_lstm)
    text = df_lstm
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""kod sonucunda bu {text} değerlerinden "Page Life Expectancy" değerlerini görselleştirmek için matplotlib kütüphanesini kullanarak bir çizgi grafiği oluşturur. Bu değerlere göre
                :\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})



@app.route('/Lstm_pagelife2_img_gpt_yorum', methods=['GET', 'POST'])
def Lstm_pagelife2_img_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin


    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    # Train - Test ayırma
    position = int(len(df_lstm) * 0.80)
    train, test = df_lstm.iloc[:position], df_lstm.iloc[position:]

    print("Train boyutu:", len(train), "Test boyutu:", len(test))
    # Standardizasyon işlemi

    scaler = MinMaxScaler()

    train_scaled = scaler.fit_transform(train)
    test_scaled = scaler.transform(test)

    def create_features(data, lookback=1):
        X, Y = [], []
        for i in range(lookback, len(data)):
            X.append(data[i-lookback : i,:])
            Y.append(data[i,0])
        return np.array(X), np.array(Y)
    # Features ve target olarak ayırma (X - y)
    lookback = 240 # son bir saat
    X_train, y_train = create_features(train_scaled, lookback)
    X_test, y_test = create_features(test_scaled, lookback)

    print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)                               # (55733, 240, 5) (55733,) (13754, 240, 5) (13754,)

    y_train_shaped = y_train.reshape(-1, 1)
    y_test_shaped = y_test.reshape(-1, 1)

    print(X_train.shape, y_train_shaped.shape, X_test.shape, y_test_shaped.shape)     # (55733, 240, 5) (55733, 1) (13754, 240, 5) (13754, 1)
    # Model kurma
    model = Sequential()
    model.add(LSTM(4, input_shape=(lookback, 5))) # lookback: 240
    model.add(Dropout(0.2))
    model.add(Dense(1))

    model.compile(loss='mean_squared_error', optimizer='adam')

    # Model eğitimi
    model.fit(X_train, y_train_shaped, epochs=5, batch_size=64, verbose=2, shuffle=False);

    # Train ve test tahminleri
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    # Tahmin ve gerçek değerleri inverse_transform için uygun formata getirme
    train_predict_reshaped = np.concatenate((train_pred.reshape(-1, 1), np.zeros((train_pred.shape[0], 4))), axis=1)
    test_predict_reshaped = np.concatenate((test_pred.reshape(-1, 1), np.zeros((test_pred.shape[0], 4))), axis=1)

    y_train_reshaped = np.concatenate((y_train.reshape(-1, 1), np.zeros((y_train.shape[0], 4))), axis=1)
    y_test_reshaped = np.concatenate((y_test.reshape(-1, 1), np.zeros((y_test.shape[0], 4))), axis=1)

    # inverse_transform işlemi (sadece ilk sütunlar gerekli)
    train_predict = scaler.inverse_transform(train_predict_reshaped)[:, 0]
    test_predict = scaler.inverse_transform(test_predict_reshaped)[:, 0]
    train_y = scaler.inverse_transform(y_train_reshaped)[:, 0]
    test_y = scaler.inverse_transform(y_test_reshaped)[:, 0]


    # MAE hata hesaplaması
    train_mae = mean_absolute_error(train_y, train_predict)
    print('Train MAE: %.2f' % (train_mae)) # Train MAE: 375.75
    test_mae = mean_absolute_error(test_y, test_predict)
    print('Test MAE: %.2f' % (test_mae)) # Test MAE: 358.04
    # MSE hata hesaplaması
    train_mse = mean_squared_error(train_y, train_predict)
    print('Train MSE: %.2f' % (train_mse)) # Train MSE: 633991.05
    test_mse = mean_squared_error(test_y, test_predict)
    print('Test MSE: %.2f' % (test_mse)) # Test MSE: 518864.51
    # RMSE hata hesaplaması
    train_rmse = np.sqrt(mean_squared_error(train_y, train_predict))
    print('Train RMSE: %.2f' % (train_rmse)) # Train RMSE: 796.24
    test_rmse = np.sqrt(mean_squared_error(test_y, test_predict))
    print('Test RMSE: %.2f' % (test_rmse)) # Test RMSE: 720.32

    pd.DataFrame(train_y).describe().T # mean: 6461.885041  std: 6095.707229
    pd.DataFrame(test_y).describe().T # mean: 6322.386942  std: 5862.962638

    # Karşılaştırma dataframe'lerinin oluşturulması
    train_prediction_df = df_lstm[lookback:position]
    train_prediction_df["Predicted"] = train_predict
    test_prediction_df = df_lstm[lookback+position:]
    test_prediction_df["Predicted"] = test_predict
    train_prediction_df # 555733 rows × 6 columns
    test_prediction_df # 13754 rows × 6 columns

    print(df_lstm)
    print(train_prediction_df)
    print(test_prediction_df)

    text1 = df_lstm
    text2 = train_prediction_df
    text3 = test_prediction_df
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""kod sonucunda "Page Life Expectancy" değerlerine ait real değerlerin {text1} ve train değerlerin {text2} ve test değerlerin {text3} olarak elde ettim ,görselleştirmek için matplotlib kütüphanesini kullanarak ortak bir çizgi grafiği oluşturur. Bu değerlere göre
                Birincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})


    
@app.route("/add_reports_lstm_data_adminpage", methods=["POST"])
def add_reports_lstm_data_adminpage():
    try:
        print("add report fonksiyonu basladi")
        data = request.get_json()
        usernamee = data.get('username')
        outputPdfPath =data.get('outputPdfPath')
        print(usernamee)
        report = outputPdfPath

        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı bilgilerini UserTable'dan çekme
        cursor.execute("SELECT UserId, UserName, Role FROM UserTable WHERE UserName = ?", usernamee)
        user_data = cursor.fetchone()
        companyiddValue = data.get('companyiddValue')
        print("selectedValueeeeeeeeeeeeeeeeeeeeeeeeeeeereportttt",companyiddValue)
        companyid = companyiddValue
        modelname ="lstm model"
        print("usertable dan veri alindi1111111")
        print(user_data)
        print("usertable dan veri alindi222222")


        if user_data:
            userid= user_data[0]
            username = user_data[1]
            role = user_data[2]

            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            cursor.execute("INSERT INTO UserLogTable (UserID, UserName, CompanyId, CreateDate, AIModelName, UserRole, Report) VALUES (?, ?, ?, ?, ?, ?, CONVERT(varbinary(max), ?))",
                (userid, username, companyid, created_at, modelname, role, report.encode('utf-8')))
            connection.commit()
            print("add report fonksiyonu ekleme yapildi")
            
            new_report = {
                'userid':userid,
                'username': username,
                'companyid' : companyid,
                'created_at': created_at,
                'AIModelName':modelname,
                'role': role,
                'report': report,
            }

            return jsonify(new_report), 201
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500

@app.route('/generate_pdf_lstm', methods=['POST'])
def generate_pdf_lstm():
    
    background_image_path = './img/image.png'
    pdf = PDFWithBackground(background_image_path)

    data = request.get_json()
    user_name = data.get('username')    
    answer = data.get('answer')
    noron = data.get('noron')
    dropout = data.get ('dropout')
    epoch = data.get ('epoch')
    batch = data.get ('batch')
    optimizer = data.get ('optimizer')
    lossfunc = data.get ('lossfunc')
    companyiddValue = data.get('companyiddValue')
    answer1 = data.get('answer1')
    print("selectedValueeeeeeeeeeeeeeeeeeeeeeeeeeee",companyiddValue)
    
    output_pdf_folder = './pdfs/'
    base_filename = "report_lstm"

    # Hedef dosya adını oluşturma fonksiyonu
    def generate_unique_filename(folder, base_filename):
        counter = 0
        new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        # Dosya adı mevcut ise sayıyı artırarak yeni benzersiz dosya adını oluştur
        while os.path.exists(os.path.join(folder, new_filename)):
            counter += 1
            new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        return new_filename

    output_pdf_path = os.path.join(output_pdf_folder, generate_unique_filename(output_pdf_folder, base_filename))

    print(output_pdf_path)

    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = f"{user_name} // {current_datetime} // LSTM Model"
    
    pdf.add_image("./img/dp_logo.png", user_info)
    pdf.set_font("helvetica", size=12)

    sample_text =f"Sayın {user_name}\n" f"{current_datetime} saatinde LSTM Modeli üzerinde yapılan çalışmaya özel olarak hazırlanan rapor sizin için sunulmuştur. Data platform şirketimizi tercih ettiğiniz için de ayrıca teşekkür ederiz. Bu raporda, model eğitiminin başarıyla tamamlanmasının ardından oluşturulan grafikler detaylı bir şekilde incelenmiş ve analiz edilmiştir.\nSeçtiğiniz LSTM Modeli parametreleri arasında Nöron sayısı: {noron} , Dropout oranı: {dropout} , Epoch sayısı: {epoch} , Batch boyutu: {batch} , Optimizer: {optimizer} ve Loss fonksiyonu :{lossfunc} değerleri bulunmaktadır, bu parametrelerin sonuçları da raporda detaylı bir şekilde açıklanmıştır."

    pdf.add_text(sample_text, " ",10,100)

    pdf.add_image('./img/Lstm_pagelife_img.png', '')
    pdf.add_text(f'{answer1}','',10,120)
    pdf.add_image('./img/Lstm_pagelife2_img.png', '')
    pdf.add_text(f'{answer}','',10,120)

    pdf.output(output_pdf_path)
    print("Yeni LSTM PDF dosyası kaydedildi.")

    return jsonify(output_pdf_path), 200



@app.route("/user_reports", methods=["POST"])
def user_reports():
    try:
        data = request.get_json()
        username = data.get('username')

        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        cursor = connection.cursor()

        cursor.execute("SELECT AIModelName, CreateDate, Report FROM UserLogTable WHERE UserName = ? ORDER BY CreateDate DESC", username)
        users = cursor.fetchall()

        user_data = []
        for user in users:
            user_data.append({
                "AIModelName": user[0],
                "CreateDate": user[1].strftime('%Y-%m-%d %H:%M:%S'),  # datetime'i stringe çevir
                "Report": user[2].decode('utf-8') if isinstance(user[2], bytes) else user[2],  # bytes türündeki veriyi stringe çevir
            })

        return jsonify(user_data), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500
    


@app.route('/download_special_pdf_button', methods=['POST'])
def download_special_pdf_button():

    data = request.get_json()
    reportUrl = data.get('reportUrl')
    print(reportUrl,"dosya yoluuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")

    pdf_path = reportUrl
    return send_file(pdf_path, as_attachment=True)


# Temel kütüphaneler
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.preprocessing import MinMaxScaler 
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Tensorflow kütüphaneleri
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, SimpleRNN, Dropout 
tf.random.set_seed(7) # Random'luğu ayarlama
# Uyarıları kapat
import warnings
warnings.filterwarnings('ignore')

@app.route('/Lstm_pagelife_img_rnn')
def Lstm_pagelife_img_rnn():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)
    (df.eq(0).sum() > 40000).sum()

    # Gereksiz sütunların çıkartılması
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[:, df.eq(0).sum() < 40000]

    len(df_1["InstanceID"].unique()) # 1


    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    plt.figure(figsize=(12, 6))
    plt.plot(df_lstm["page life expectancy"], color="b")
    plt.ylabel("Values", fontsize=12)
    plt.xlabel("Time", fontsize=12)
    plt.title("Page Life Expectancy", fontsize=14)

    plt.xticks(np.arange(0, len(df_lstm), 13990), fontsize=10)
    plt.yticks(fontsize=10)

    plt.grid(axis='x', linestyle='--', alpha=0.7)
    plt.show()

    # Görüntüyü kaydet
    plt.savefig('./img/Lstm_pagelife_img_rnn.png')
    

    # Görüntüyü React tarafina gönder
    return send_file('./img/Lstm_pagelife_img_rnn.png', mimetype='image/png')


@app.route('/Lstm_pagelife_img_rnn_gpt_yorum', methods=['GET', 'POST'])
def Lstm_pagelife_img_rnn_gpt_yorum():
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY") # Buraya kendi API anahtarınızı ekleyin

    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_lstm = pd.DataFrame(
        df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
        index=df["CreateDate"],
        columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )

    print(df_lstm)
    text = df_lstm
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""kod sonucunda bu {text} değerlerinden "Page Life Expectancy" değerlerini görselleştirmek için matplotlib kütüphanesini kullanarak bir çizgi grafiği oluşturur. Bu değerlere göre
                :\n\n{text}\nBirincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    answer = response.choices[0].message.content
    print(answer)
    return jsonify({"answer": answer})




@app.route('/Lstm_pagelife2_img_rnn',methods=['GET', 'POST'])
def Lstm_pagelife2_img_rnn():
    # Veri setini yükle
    df = pd.read_csv(yuklenen_dosya_path)
    form_data = request.json

    (df.eq(0).sum() > 40000).sum() # 29

    # Gereksiz sütunların çıkartılması   
    # 40.000'den az sayıda 0 değerine sahip sütunlar ile oluşturulan dataframe
    df_1 = df.loc[: , df.eq(0).sum() < 40000]
    len(df_1["InstanceID"].unique()) # 1

    df_rnn = pd.DataFrame(
    df[["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]].values,
    index=df["CreateDate"],
    columns=["page life expectancy", "% privileged time", "transactions/sec", "write transactions/sec", "logical connections"]
    )
    df_rnn
    # Train - Test ayırma
    position = int(len(df_rnn) * 0.80)
    train, test = df_rnn.iloc[:position], df_rnn.iloc[position:]

    print("Train boyutu:", len(train), "Test boyutu:", len(test))

    # Standardizasyon işlemi
    scaler = MinMaxScaler()

    train_scaled = scaler.fit_transform(train)
    test_scaled = scaler.transform(test)

    def create_features(data, lookback=1):
        X, Y = [], []
        for i in range(lookback, len(data)):
            X.append(data[i-lookback : i,:])
            Y.append(data[i,0])
        return np.array(X), np.array(Y)
    # Features ve target olarak ayırma (X - y)
    lookback = 240
    X_train, y_train = create_features(train_scaled, lookback)
    X_test, y_test = create_features(test_scaled, lookback)

    print(X_train.shape, y_train.shape, X_test.shape, y_test.shape)

    noron = form_data.get('noron')
    dropout = form_data.get('dropout')
    epoch = form_data.get('epoch')
    batch = form_data.get('batch')
    optimizer = form_data.get('optimizer')
    lossfunc = form_data.get('lossfunc')
    activation = form_data.get('activation')
    print("aktivationnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",activation)


    model = Sequential()
    model.add(SimpleRNN(noron, activation = activation, input_shape=(lookback, 5))) # lookback: 240
    model.add(Dropout(dropout))
    model.add(Dense(1))

    model.compile(loss=lossfunc, optimizer= optimizer)

    # Model eğitimi
    model.fit(X_train, y_train, epochs=epoch, batch_size=batch, verbose=2, shuffle=False)

    # Train ve test tahminleri
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    # Tahmin ve gerçek değerleri inverse_transform için uygun formata getirme
    train_predict_reshaped = np.concatenate((train_pred.reshape(-1, 1), np.zeros((train_pred.shape[0], 4))), axis=1)
    test_predict_reshaped = np.concatenate((test_pred.reshape(-1, 1), np.zeros((test_pred.shape[0], 4))), axis=1)

    y_train_reshaped = np.concatenate((y_train.reshape(-1, 1), np.zeros((y_train.shape[0], 4))), axis=1)
    y_test_reshaped = np.concatenate((y_test.reshape(-1, 1), np.zeros((y_test.shape[0], 4))), axis=1)


    # inverse_transform işlemi (sadece ilk sütunlar gerekli)
    train_predict = scaler.inverse_transform(train_predict_reshaped)[:, 0]
    test_predict = scaler.inverse_transform(test_predict_reshaped)[:, 0]
    train_y = scaler.inverse_transform(y_train_reshaped)[:, 0]
    test_y = scaler.inverse_transform(y_test_reshaped)[:, 0]

    # Ortalama Mutlak Hata (MAE) hesaplama
    def mean_absolute_errorr(y_true, y_pred):
        mae = np.mean(np.abs(y_true - y_pred))
        return mae

    # Ortalama Karesel Hata (MSE) hesaplama
    def mean_squared_error(y_true, y_pred):
        mse = np.mean((y_true - y_pred) ** 2)
        return mse

    # Kök Ortalama Karesel Hata (RMSE) hesaplama
    def root_mean_squared_errorr(y_true, y_pred):
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        return rmse

    # MAE hata hesaplaması
    train_mae = mean_absolute_errorr(train_y, train_predict)
    print('Train MAE: %.2f' % (train_mae))

    test_mae = mean_absolute_errorr(test_y, test_predict)
    print('Test MAE: %.2f' % (test_mae))

    # MSE hata hesaplaması
    train_mse = root_mean_squared_errorr(train_y, train_predict)
    print('Train MSE: %.2f' % (train_mse))

    test_mse = root_mean_squared_errorr(test_y, test_predict)
    print('Test MSE: %.2f' % (test_mse))

    # RMSE hata hesaplaması
    train_rmse = np.sqrt(root_mean_squared_errorr(train_y, train_predict))
    print('Train RMSE: %.2f' % (train_rmse))

    test_rmse = np.sqrt(root_mean_squared_errorr(test_y, test_predict))
    print('Test RMSE: %.2f' % (test_rmse))



    # Gerçek ve tahmin değerler üzerinde MAPE hesaplama
    def calculate_mape(actual, forecast):
        if len(actual) != len(forecast):
            raise ValueError("Gerçek ve tahmin edilen değer listeleri aynı uzunlukta olmalıdır.")
        
        n = len(actual)
        total_error = 0
        for i in range(n):
            if actual[i] != 0:
                total_error += abs((actual[i] - forecast[i]) / actual[i])
            else:
                total_error += abs(forecast[i])  # Eğer gerçek değer sıfırsa, tahmini direkt olarak kullan

        mape = ((total_error / n) * 10 )
        return mape
    

    # R-kare hesaplama
    def calculate_r2(y_true, y_pred):
        return r2_score(y_true, y_pred)

    scaler = MinMaxScaler()
    train_y_scaled = scaler.fit_transform(y_train.reshape(-1, 1)).flatten()
    test_y_scaled = scaler.transform(y_test.reshape(-1, 1)).flatten()

    train_predict_scaled = scaler.transform(train_pred.reshape(-1, 1)).flatten()
    test_predict_scaled = scaler.transform(test_pred.reshape(-1, 1)).flatten()

    train_mape_scaled = calculate_mape(train_y_scaled, train_predict_scaled)
    print('Train MAPE (scaled): %.2f' % train_mape_scaled)

    test_mape_scaled = calculate_mape(test_y_scaled, test_predict_scaled)
    print('Test MAPE (scaled): %.2f' % test_mape_scaled)


    # R-kare hesaplama
    train_r2 = calculate_r2(train_y, train_predict)
    print('Train R^2: %.2f' % train_r2) # Train R^2: 
    test_r2 = calculate_r2(test_y, test_predict)
    print('Test R^2: %.2f' % test_r2) # Test R^2: 


    error_values = [train_mae, test_mae, train_mse, test_mse, train_rmse,test_rmse,train_mape_scaled,test_mape_scaled,train_r2,test_r2]

  

    pd.DataFrame(train_y).describe().T  
    pd.DataFrame(test_y).describe().T
    # Karşılaştırma dataframe'lerinin oluşturulması
    train_prediction_df = df_rnn[lookback:position]
    train_prediction_df["Predicted"] = train_predict

    test_prediction_df = df_rnn[lookback+position:]
    test_prediction_df["Predicted"] = test_predict

    train_prediction_df
    test_prediction_df
    # Görselleştirme

    plt.figure(figsize=(12, 6))
    plt.plot(df_rnn["page life expectancy"], color="b", label="Real Values")
    plt.plot(train_prediction_df.Predicted, color="r", label="Train predicted")
    plt.plot(test_prediction_df.Predicted, color="g", label="Test predicted")

    plt.legend(loc = "upper right")
    plt.xlabel("Time", fontsize=12)
    plt.ylabel("Values", fontsize=12)
    plt.title("Page Life Expectancy", fontsize=14)

    plt.xticks(np.arange(0, len(df_rnn), 13990), fontsize=10)
    plt.yticks(fontsize=10)

    plt.grid(axis='x', linestyle='--', alpha=0.7)
    plt.show()


    # Görüntüyü kaydet
    plt.savefig('./img/Lstm_pagelife2_img_rnn.png')

    text1 = df_rnn
    text2 = train_prediction_df
    text3 = test_prediction_df
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Sen bir metin analizcisisin."},
            {"role": "user", "content": f"""kod sonucunda "Page Life Expectancy" değerlerine ait real değerlerin {text1} ve train değerlerin {text2} ve test değerlerin {text3} olarak elde ettim ,görselleştirmek için matplotlib kütüphanesini kullanarak ortak bir çizgi grafiği oluşturur. Bu değerlere göre
                Birincil ağızdan bu sonuçları aşağıdaki formata uygun şekilde yorumlar mısın? 
                Chat-GPT tarafından üretilen analiz: 'senin analizin'
                bu formatta üretmeni istiyorum."""}
        ]
    )
    
    # Örnek olarak response.choices[0].message.content'ten cevabı alıyoruz
    answer = response.choices[0].message.content
    result ={
        "answer": answer ,
        "noron" : noron ,
        "dropout" : dropout ,
        "epoch" : epoch ,
        "batch" : batch ,
        "optimizer" : optimizer ,
        "lossfunc" : lossfunc ,
        "activation" : activation ,
        "error_values" : error_values
    }

    return jsonify(result)



@app.route('/Lstm_pagelife2_img_rnn_path',methods=['GET'])
def Lstm_pagelife2_img_rnn_path():
    # Görüntüyü React tarafina gönder
    return send_file('./img/Lstm_pagelife2_img_rnn.png', mimetype='image/png')


   
@app.route("/add_reports_rnn_data_adminpage", methods=["POST"])
def add_reports_rnn_data_adminpage():
    try:
        print("add report fonksiyonu basladi")
        data = request.get_json()
        usernamee = data.get('username')
        outputPdfPath =data.get('outputPdfPath')
        print(usernamee)
        report = outputPdfPath

        # Tarihi ISO 8601 formatında bir stringe dönüştür
        created_at = datetime.now().replace(microsecond=0).isoformat()

        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        
        # Cursor oluşturma
        cursor = connection.cursor()

        # Kullanıcı bilgilerini UserTable'dan çekme
        cursor.execute("SELECT UserId, UserName, Role FROM UserTable WHERE UserName = ?", usernamee)
        user_data = cursor.fetchone()
        companyiddValue = data.get('companyiddValue')
        print("selectedValueeeeeeeeeeeeeeeeeeeeeeeeeeeereportttt",companyiddValue)
        companyid = companyiddValue
        modelname ="rnn model"
        print("usertable dan veri alindi1111111")
        print(user_data)
        print("usertable dan veri alindi222222")


        if user_data:
            userid= user_data[0]
            username = user_data[1]
            role = user_data[2]

            # Yeni kullanıcıyı oluştur ve veritabanına kaydet
            cursor.execute("INSERT INTO UserLogTable (UserID, UserName, CompanyId, CreateDate, AIModelName, UserRole, Report) VALUES (?, ?, ?, ?, ?, ?, CONVERT(varbinary(max), ?))",
                (userid, username, companyid, created_at, modelname, role, report.encode('utf-8')))
            connection.commit()
            print("add report fonksiyonu ekleme yapildi")
            
            new_report = {
                'userid':userid,
                'username': username,
                'companyid' : companyid,
                'created_at': created_at,
                'AIModelName':modelname,
                'role': role,
                'report': report,
            }

            return jsonify(new_report), 201
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        print(e)
        return jsonify({"error": "Server error."}), 500



@app.route('/generate_pdf_rnn', methods=['POST'])
def generate_pdf_rnn():
    
    background_image_path = './img/image.png'
    pdf = PDFWithBackground(background_image_path)

    data = request.get_json()
    user_name = data.get('username')    
    answer = data.get('answer')
    noron = data.get('noron')
    dropout = data.get ('dropout')
    epoch = data.get ('epoch')
    batch = data.get ('batch')
    optimizer = data.get ('optimizer')
    lossfunc = data.get ('lossfunc')
    activation = data.get ('activation')
    companyiddValue = data.get('companyiddValue')
    answer1 = data.get('answer1')
    print("selectedValueeeeeeeeeeeeeeeeeeeeeeeeeeee",companyiddValue)
    
    output_pdf_folder = './pdfs/'
    
    base_filename = "report_rnn"

    # Hedef dosya adını oluşturma fonksiyonu
    def generate_unique_filename(folder, base_filename):
        counter = 0
        new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        # Dosya adı mevcut ise sayıyı artırarak yeni benzersiz dosya adını oluştur
        while os.path.exists(os.path.join(folder, new_filename)):
            counter += 1
            new_filename = f"{base_filename}_{user_name}_{counter}.pdf"

        return new_filename

    output_pdf_path = os.path.join(output_pdf_folder, generate_unique_filename(output_pdf_folder, base_filename))

    print(output_pdf_path)

    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = f"{user_name} // {current_datetime} // RNN Model"
    
    pdf.add_image("./img/dp_logo.png", user_info)
    pdf.set_font("helvetica", size=12)

    sample_text =f"Sayın {user_name}\n" f"{current_datetime} saatinde RNN Modeli üzerinde yapılan çalışmaya özel olarak hazırlanan rapor sizin için sunulmuştur. Data platform şirketimizi tercih ettiğiniz için de ayrıca teşekkür ederiz. Bu raporda, model eğitiminin başarıyla tamamlanmasının ardından oluşturulan grafikler detaylı bir şekilde incelenmiş ve analiz edilmiştir.\nSeçtiğiniz RNN Modeli parametreleri arasında Nöron sayısı: {noron} , Dropout oranı: {dropout} , Epoch sayısı: {epoch} , Batch boyutu: {batch} , Aktivasyon fonksiyonu: {activation} , Optimizer: {optimizer} ve Loss fonksiyonu :{lossfunc} değerleri bulunmaktadır, bu parametrelerin sonuçları da raporda detaylı bir şekilde açıklanmıştır."

    pdf.add_text(sample_text, " ",10,100)

    pdf.add_image('./img/Lstm_pagelife_img.png', '')
    pdf.add_text(f'{answer1}','',10,120)
    pdf.add_image('./img/Lstm_pagelife2_img.png', '')
    pdf.add_text(f'{answer}','',10,120)

    pdf.output(output_pdf_path)
    print("Yeni LSTM PDF dosyası kaydedildi.")

    add_reports_rnn_data_adminpage()

    return jsonify(output_pdf_path), 200



@app.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    user_name = data.get('username')  
    print(user_name)
    # Bağlantı oluşturma Windows Authentication ile
    connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
    cursor = connection.cursor()
    try:
        # Kullanıcıya ait log kayıtlarını silme
        cursor.execute("DELETE FROM UserLogTable WHERE UserID = (SELECT UserID FROM UserTable WHERE UserName = ?)", user_name)
        
        # Kullanıcıyı silme
        cursor.execute("DELETE FROM UserTable WHERE UserName = ?", user_name)
        
        connection.commit()
        print("Kullanıcı başarıyla silindi")
        return 'kullanici silindi', 200
    except pyodbc.IntegrityError as e:
        connection.rollback()
        print("Referans bütünlüğü hatası: ", e)
        return 'Referans bütünlüğü hatası', 500
    finally:
        cursor.close()
        connection.close()


TOKEN = "7011712452:AAGbdazCnFweSAfClvmoDhgsByRba29i7SU"
# message = "Bu bir otomatik mesajdır Aisan."
# chat_id = 560481085
import requests

@app.route('/send_telegram_message', methods=['POST'])
def send_telegram_message():
    data = request.get_json()
    message = data.get('text')  
    chat_id = data.get('chat_id')  
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    data = {
        "chat_id": chat_id,
        "text": message
    }
    response = requests.post(url, data=data)
    print("olduuuu bot chat")
    
    if response.status_code == 200:
        return "Message sent to Telegram!"
    else:
        return "Failed to send message to Telegram."
    

from flask import Flask, request
from flask_mail import Mail, Message
import random
import string
# Flask-Mail ayarları
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'aisankheiri20@gmail.com'
app.config['MAIL_PASSWORD'] = 'sduc nbqx rvmn puqo'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

# Rasgele doğrulama kodu oluşturma fonksiyonu
def generate_verification_code():
    return ''.join(random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=6))

# Doğrulama kodu gönderme endpoint'i
@app.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    data = request.get_json()
    email = data.get('email')

    if email:
        verification_code = generate_verification_code()
        print(verification_code)
        email = ''.join(['"', data.get('email'), '"'])

        msg = Message('Doğrulama Kodu', sender='aisankheiri20@gmail.com', recipients=[email])
        msg.body = f"Doğrulama kodunuz: {verification_code}"

        mail.send(msg)
        print("Doğrulama kodu adresine gönderildi.")
        response = {
                'message': f'Doğrulama kodu {email} adresine gönderildi.',
                'verification_code': verification_code
            }
    
        return jsonify(response)
    else:
        return 'E-posta adresi belirtilmedi.'
    

@app.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()
    email = data.get('email')  
    new_password = data.get('new_password')  
    # Parolayı hashle
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    print(email)
    print(new_password)
    print(hashed_password)
    
    # Bağlantı oluşturma Windows Authentication ile
    connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
    cursor = connection.cursor()
    
    try:
        cursor.execute("UPDATE UserTable SET Password = ? WHERE Email = ?", hashed_password, email)
        connection.commit()
        print("Şifre başarıyla değişti")
        return 'Şifre başarıyla değişti', 200
    
    except pyodbc.Error as e:
        connection.rollback()
        print("Veritabanı hatası: ", e)
        return 'Veritabanı hatası', 500
    finally:
        cursor.close()
        connection.close()


@app.route('/check_email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')

    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM UserTable WHERE Email = ?", email)
        row = cursor.fetchone()

        if row:
            print("Kullanıcı bulundu")
            return 'Kullanıcı bulundu', 200
        else:
            print("Kullanıcı bulunamadı")
            return 'Kullanıcı bulunamadı', 404

    except pyodbc.Error as e:
        print("Veritabanı hatası:", e)
        return 'Veritabanı hatası', 500

    finally:
        cursor.close()
        connection.close()

@app.route('/check_password_not_same', methods=['POST'])
def check_password_not_same():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # Parolayı hashle

    try:
        # Bağlantı oluşturma Windows Authentication ile
        connection = pyodbc.connect('DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + database + ';Trusted_Connection=yes')
        cursor = connection.cursor()

        cursor.execute("SELECT Password FROM UserTable WHERE Email = ?", email)
        user = cursor.fetchone()
        is_password_not_same = bcrypt.check_password_hash(user.Password, password)
       

        if not is_password_not_same :
            print("var olan şifre ile yeni şifre aynı değil")
            return 'var olan şifre ile yeni şifre aynı değil', 200
        else:
            print("var olan şifre ile yeni şifre aynı")
            return 'var olan şifre ile yeni şifre aynı', 404

    except pyodbc.Error as e:
        print("Veritabanı hatası:", e)
        return 'Veritabanı hatası', 500

    finally:
        cursor.close()
        connection.close()


if __name__ == '__main__':
    app.run()