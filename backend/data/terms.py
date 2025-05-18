from models import ITTerm

# サンプル用語データ
it_terms = [
    ITTerm(term="HTTP", fullName="Hypertext Transfer Protocol", 
           description="Webページを転送するための通信プロトコル"),
    ITTerm(term="CSS", fullName="Cascading Style Sheets", 
           description="Webページのデザインを指定するための言語"),
    ITTerm(term="HTML", fullName="Hypertext Markup Language", 
           description="Webページを構成するためのマークアップ言語"),
    ITTerm(term="API", fullName="Application Programming Interface", 
           description="ソフトウェア間のインターフェース"),
    ITTerm(term="SQL", fullName="Structured Query Language", 
           description="データベースを操作するための言語")
]

def get_terms():
    return it_terms

def find_term(term_str: str):
    """指定された文字列に一致する用語を検索"""
    term_upper = term_str.upper()
    for term in it_terms:
        if term.term.upper() == term_upper:
            return term
    return None