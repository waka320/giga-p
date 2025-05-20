import sys
import os
import csv
import logging

# 先にパスを追加してから相対インポートを行う
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# 絶対インポートに変更
from database.db_manager import DBManager
from data.terms import seed_database
from models import ITTerm
from database.term_repository import TermRepository