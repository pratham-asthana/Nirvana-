def OCR(pdf_path):   #This is extraction of text using OCR. Will only be used if simple extraction doesn't work
    import pytesseract
    from pdf2image import convert_from_path
    try:
        images = convert_from_path(pdf_path)
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Text extraction failed: {e}")

#This function is used to extract text from pdf. This is simple extraction without OCR
def text_from_pdf(pdf_path):
    import pdfplumber
    text=""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
        if text.strip():
            return text.strip()
    except Exception as e:
        OCR(pdf_path)

def resume_analyser(Extracted_text, JD):
    from transformers import AutoTokenizer, AutoModel
    import torch
    import torch.nn.functional as F

    #Using a pre-trained model called jobBERT
    model_path = "jobBERT-model"

    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModel.from_pretrained(model_path)

    resume_text = Extracted_text
    job_description = JD

    inputs = tokenizer([resume_text, job_description],
                    padding=True, truncation=True, return_tensors="pt")

    # Get embeddings
    with torch.no_grad():
        outputs = model(**inputs)
        # Average pooling of token embeddings to get sentence embedding
        embeddings = outputs.last_hidden_state.mean(dim=1)   #Using mean to use one vector to represent a whole sentence

    # Compute cosine similarity
    similarity = F.cosine_similarity(
        embeddings[0].unsqueeze(0),
        embeddings[1].unsqueeze(0)
    ).item()  #unsqueeze function is for changing the shape of embeddings. It makes it (1, value) from just (value)

    # Convert to ATS score
    ats_score = round(similarity * 100, 2)
    return {
        "Extracted_Text" : Extracted_text,
        "Resume_Embeddings" : embeddings[0],
        "JD_Embeddings" : embeddings[1],
        "Similarity" : similarity,
        "ATS_Score" : ats_score
    }