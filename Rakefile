require 'json'

def json_write(rows, name, opts)
  rows = rows.dup
  id = opts[:index] || 'id'

  data = []
  headers = rows.shift
  rows.each_with_index do |row, idx|
    row_hash = {id => idx + 1}
    row.each_with_index { |e, i| row_hash[headers[i]] = e }
    data << row_hash
  end

  File.open(name, "w") { |file| file << data.to_json }
end


desc 'Fetch data from the spreadsheet'
task :fetch do
  require "google_spreadsheet"
  require 'json'

  print "fetching spreadsheet..."

  user = ENV['GOOGLE_USER'] or raise "must set GOOGLE_USER"
  pass = ENV['GOOGLE_PASS'] or raise "must set GOOGLE_PASS (may be a file path)"

  passfile = File.expand_path(pass)
  pass = File.read(passfile) if File.exist?(passfile)

  sheet = GoogleSpreadsheet.login(user, pass).spreadsheet_by_key("0ApjAqinI2AJCdDE0OGN2ZzllcUtmeVRzREJDaFVzUVE")
  puts "done."

  print 'fetching rows...'
  session_rows = sheet.worksheets[0].rows
  speaker_rows = sheet.worksheets[1].rows
  puts 'done.'

  print 'writing json...'
  json_write session_rows, 'sessions.json', :index => 'nid'
  json_write speaker_rows, 'speakers.json', :index => 'uid'
  puts 'done.'
end

desc 'Upload JSON to the server'
task :upload do
  host = ENV['host'] or raise "please specify the host"
  sh "scp", "-r", "speakers.json", "sessions.json", "#{host}:/sites/files.jaribakken.com/www/tmp/"
end

task :refresh => [:fetch, :upload]