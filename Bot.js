require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const schedule = require('node-schedule');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');


client.on("ready", () =>{
    console.log("Bot is ready")
});

client.on('message',  msg => {
    //Testing if bot is up and running or not
    if (msg.content === '!ping') {
        msg.reply('Pong!');
    }

    //Commands 
    else if(msg.content.startsWith('!show')){
        var res = '🗓️ **Scheduling Task -> !schedule <#data> <#time> <#Title> <#Topic>**\n\n';
        res += '👩‍🏫 **Faculty Information -> !faculty info + <initial of the faculty>**\n\n';
        res += '✅ **Getting Marks privately -> !result + <Exam name and number> + <your roll>**\n\n';
        res += '📊 **Polling system -> !polls + <#Query> + <#option1 #option2... #optionN>**\n\n';
        res += '⏱️ **Deadlines -> !deadlines + <week + number of the week>\n\n**'
        res += '📚 **Course Information -> !course info + <course name>**\n\n'
        res += '💯 **Practice Quiz -> !practice + <quiz>**\n\n'
        res += '📝 **Form Fillup -> !fillup + <#form name> + <#field1 #field2... #fieldN>**\n\n'
        res += '💁 **Attendance -> !present + <Your roll>**\n';

        const embed = new Discord.MessageEmbed()
            .setTitle('Commands Manual')
            .setDescription(res)
            .setColor('#40ff00')
        msg.channel.send(embed);
    }

    //Scheduling a task
    else if(msg.content.startsWith('!schedule')){

        //!schedule #2020-12-07 #02:00 #important news #Kije korum bujhtisi na, ar ki kisu add kora jay? aro kichu idea dau
        var pars = msg.content.split('#');

        var time_date = pars[1].trim()+'T'+pars[2].trim()+'+0600';
        console.log(time_date);
        const some = new Date(time_date)

        schedule.scheduleJob(some, () =>{
            const embed = new Discord.MessageEmbed()
                .setTitle('**'+pars[3]+'**')
                .setDescription('@everyone \n' + '**' + pars[4] + '**')
                .setColor('#00ffff')
            msg.channel.send(embed);
        })
    }

    //Faculty information
    else if(msg.content.startsWith('!faculty info')){

        //sample faculty info
        var faculty_info = {
            SEJ : ['Sifat E Jahan' ,'CSE110', 'CSE111', 'CSE220', 'CSE221', 'CSE320', 'CSE220', 'sifat.jahan@bracu.ac.bd', 'UB50301'],
            AHR : ['Ahanaf Hassan Rodoshi', 'CSE110', 'CSE111', 'CSE220', 'CSE221', 'CSE220','CSE260', 'ahanaf.hassan@bracu.ac.bd', 'UB50302'],
            SZN : ['Shakila Zaman' ,'CSE111', 'CSE220', 'CSE321', 'CSE362', 'shakila.zaman@bracu.ac.bd', 'UB50409'],
            ARF : ['Arif Shakil', 'CSE320', 'CSE341', 'CSE421', 'CSE423', 'CSE461', 'arif.shakil@bracu.ac.bd', 'UB50302'],
            TNR : ['Tanvir Rahman', 'CSE110', 'CSE220', 'CSE230', 'CSE320', 'CSE331', 'tanvir.rahman@bracu.ac.bd', 'UB80905']
        }
        
        const initial = msg.content.substring(14);
        var res = `**Name :** ${faculty_info[initial][0]}\n**Courses : **`;
        var len = faculty_info[initial].length;

        for(var i=1; i<len-2; i++){
            res += faculty_info[initial][i] + ' ';
        }

        res += `**\nMail :** ${faculty_info[initial][len-2]}\n**Room :** ${faculty_info[initial][len-1]}`;
        const embed = new Discord.MessageEmbed()
            .setTitle(`**Faculty Info of ${initial}**`)
            .setDescription(res)
            .setColor('#e61919')
        msg.channel.send(embed);
    }

    //Search by course
    else if(msg.content.startsWith('!course info')){

        //sample course list
        var course_info ={
            CSE110 : ['Programming language I', 'RAK','SEJ','AHR','SZN(Laboratory)','WRA','AKO','ISH','TAW', 'No pre requisite'],
            CSE111 : ['Programming language II', 'MIH', 'AAR', 'SEJ', 'SI', 'RAK', 'AHR', 'WRA', 'AKO', 'DZK', 'SRF', 'TNR', 'TDS', 'TAW','SZN(Laboratory)', 'CSE110'],
            CSE220 : ['Data Structures', 'RAK','SI','SEJ','AHR','WRA','SRF','TNR', 'CSE111'],
            CSE221 : ['Algorithms', 'RAK','SI','SEJ','AKO','SRF','ISH(Laboratory)','ARH','TNR','TDS', 'CSE220']
        }

        const course_name = msg.content.substring(13);
        console.log(course_name);
        var res ='**Course Name : **' +course_info[course_name][0]+'\n**Faculties : **';

        for(var i=1;i<course_info[course_name].length-1;i++){
            if(i != course_info[course_name].length - 2){
                res += course_info[course_name][i]+', ';
            } else {
                res += course_info[course_name][i];
            }
        }

        res += '\n**Pre Requisite Course/s : **'+ course_info[course_name][course_info[course_name].length-1];

        var syl = 'https://www.bracu.ac.bd/academics/departments/computer-science-and-engineering/bachelor-science-computer-science-and/cse-0';

        const embed = new Discord.MessageEmbed()
            .setTitle(`**Course Info of ${course_name}**`)
            .setDescription(res)
            .setColor('#98AFC7')
            .setURL(syl)
        msg.channel.send(embed);
    }
    
    //Getting marks privately
    else if(msg.content.startsWith('!result')){

        //sample Result set
        var Result = {
            19301198 : [{Quiz1 : 25}, {Quiz2 : 30}, {Quiz3 : 11}, {Mid : 33}],
            19301199 : [{Quiz1 : 26}, {Quiz2 : 30}, {Quiz3 : 27}, {Mid : 43}],
            19301197 : [{Quiz1 : 24}, {Quiz2 : 30}, {Quiz3 : 15}, {Mid : 24}],
            19301196 : [{Quiz1 : 22}, {Quiz2 : 30}, {Quiz3 : 26}, {Mid : 48}],
            19301195 : [{Quiz1 : 21}, {Quiz2 : 30}, {Quiz3 : 14}, {Mid : 33}],
        }
        
        var roll = msg.content.substring(14).trim();
        if(msg.content.substring(8, 12).trim() === 'Quiz'){
            var number = (msg.content.substring(12, 13) - 1);
            var mark = JSON.stringify(Result[roll][number]);
            var res = mark.split(':');
            msg.author.send("You got " + res[1].substr(0, res[1].length-1) + " on " + res[0].substr(2, res[0].length-3));
        }
    }

    //Automatic polling system
    else if(msg.content.startsWith('!polls')){

        const emo = ['↘️', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
        var polls = msg.content.split("#");
        var res = '';
        polls.shift();

        for(var i=1;i<polls.length;i++){
            res += `**${emo[i]}  =  ${polls[i]}**\n\n`;
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(emo[0] + '   ' + polls[0] + '\n\n')
            .setDescription(res)
            .setColor('#FC0063')

        msg.channel.send(embed).then(messageReaction =>{
            for(var i=1;i<polls.length;i++){
                messageReaction.react(emo[i]);
            }
        })
    }

    //Deadlines
    else if(msg.content.startsWith('!deadlines')){

        //sample deadlines
        var deadlines = {
            week7 : [
                'Pop up quiz on Multiplexing till 10/12/20\n\n', 
                'Pop up quiz on Frequency Division Multiplexing till 10/12/20\n\n',
                'Consultation on WDM concept on 12/12/20\n\n', 
                'Problem solving of FDM Example\n'
            ],
            week8 : [
                'Pop up quiz on Basics of Transmission Media on 20/12/20\n\n',
                'Pop up quiz on Cables on 20/12/20\n\n',
                'Quiz on Basics of Unguided Media on 21/12/20\n\n',
                'Consultation on Radiowaves, Microwaves, Infrared\n'
            ]
        }

        const week = msg.content.substring(11);
        var res = '';

        for(var i=0;i<deadlines[week].length;i++){
            res += (deadlines[week][i]);
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`**Deadlines of ${week} **`)
            .setDescription('**' + res + '**')
            .setColor('#0095FC')

        msg.channel.send(embed);
    }

    //Practice Quiz
    else if(msg.content.startsWith('!practice')){
        var ques = [
            '**In which network topology all the nodes are connected to a single device known as a central device?**\n1. Bus\n2. Ring\n3. Star\n4. Mesh #3 #1. Star topolpgy',
            '**Which network topology is also known as the expanded star topology**\n1. Tree\n2. Ring\n3. Hybrid\n4. Mesh #1 #2. Tree',
            '**The reliability of a network can be measured by which of the following factors**\ni)Downtime ii)Failure Frequency iii)Catastrophe\n1. i & ii\n2. ii & iii\n3. i & iii\n4. i, ii & iii #4 #3. i, ii & iii',
            '**DNS is an acronym stands for?**\n 1. Domain Name System.\n 2. Domain Name Server\n 3. Domain Nevigation Server\n 4. Domain Nevigation System  #1 #4. Domain Name System',
            '**NIC stands for?**\n 1. Network Interface Cable\n 2. Network Interface Card\n 3. Network Interactive Card\n 4. Network Interface Connection #2 #5. Network Interface Card'
        ]

        let count = 0;

        filter = m => m.author.id === msg.author.id;

        const collector = new Discord.MessageCollector(msg.channel, filter, {
            max: ques.length,
            time: 1000 * 60
        })

        msg.channel.send(ques[count++].split('#')[0])
        collector.on('collect', m =>{
            if(count < ques.length){
                msg.channel.send(ques[count++].split('#')[0]);
            }
        })

        collector.on('end', collected => {
            msg.channel.send(`answered ${collected.size} ques`)

            let count = 0, mark = 0;
            collected.forEach((value) => {
                var pars = ques[count++].split('#');
                if(pars[1].trim() === value.content.trim()){
                    mark++;
                }
                //msg.channel.send(value.content)
            })

            msg.channel.send(`**You got ${mark}/${ques.length} **`);

            msg.channel.send('**Answers:**\n')

            for(var i=0;i<ques.length;i++){
                msg.channel.send(ques[i].split('#')[2] + '  ');
            }
        })
    }

    //Form Fill up
    else if(msg.content.startsWith('!fillup')){
        var pars = msg.content.split('#');

        var doc = new GoogleSpreadsheet('1tLIzsp28TBxZtMSDv3Lj4Y_UfhyMx3hbR64AUD5MwDw');

        var date = new Date;
        var time = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+' ';
        time += date.getHours()+':'+date.getMinutes()+'+0600 GMT';

        doc.useServiceAccountAuth(creds, function (err) {

            doc.addRow(1, { Name : pars[2], Roll : pars[3], email: pars[4], Credits: pars[5], NextCourses: pars[6], Time: time }, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    msg.reply('Your form has been submitted Successfully');
                }
            });
        });
    }

    //Attendance 
    else if(msg.content.startsWith('!present')){

        //Sample user info
        var user_info = {
            19301198 : ['Md.Zariful Huq', '19301198', '528800331229036545'],
            19301199 : ['Farah Jesmin Khan', '19301199', '734126225169055826'],
            19301197 : ['Nazia Nijum', '19301197', '734686167899045899']
        }

        var roll = msg.content.substring(9);
        //console.log(user_info[roll][2]);
        var id = msg.author.id;
        var name = msg.author.username;

        var date = new Date;
        var time = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+' ';
        time += date.getHours()+':'+date.getMinutes()+'+0600 GMT';

        if(id === user_info[roll][2]){
            var doc = new GoogleSpreadsheet('1x-TMBLKpnznRZf2rYPbTSbqtPuS3-eG80rsiH7sQ8Xg');

            doc.useServiceAccountAuth(creds, function (err) {

                doc.addRow(1, { Name : user_info[roll][0], Roll : user_info[roll][1], Discord_User_Name: name, Discord_Id: id, Time: time }, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        msg.reply('Your attendance taken Successfully');
                    }
                });
            });
        } else {
            msg.channel.send('🤣 haha, Proxy? lol ');
        }
    }

    
});

client.login(process.env.TOKEN)