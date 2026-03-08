import docx
import json
import sys

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_docx.py <path_to_docx>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    try:
        text = extract_text_from_docx(file_path)
        print(text)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
