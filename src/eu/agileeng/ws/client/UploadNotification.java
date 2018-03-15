
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for UploadNotification complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="UploadNotification">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="operatorId" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="boxId" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="docId" type="{http://www.w3.org/2001/XMLSchema}long"/>
 *         &lt;element name="message" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="messageDuration" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "UploadNotification", propOrder = {
    "operatorId",
    "boxId",
    "docId",
    "message",
    "messageDuration"
})
public class UploadNotification {

    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected int operatorId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String boxId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected long docId;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected String message;
    @XmlElement(namespace = "http://service.frontal.dematbox.sagemcom.com/")
    protected int messageDuration;

    /**
     * Gets the value of the operatorId property.
     * 
     */
    public int getOperatorId() {
        return operatorId;
    }

    /**
     * Sets the value of the operatorId property.
     * 
     */
    public void setOperatorId(int value) {
        this.operatorId = value;
    }

    /**
     * Gets the value of the boxId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBoxId() {
        return boxId;
    }

    /**
     * Sets the value of the boxId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBoxId(String value) {
        this.boxId = value;
    }

    /**
     * Gets the value of the docId property.
     * 
     */
    public long getDocId() {
        return docId;
    }

    /**
     * Sets the value of the docId property.
     * 
     */
    public void setDocId(long value) {
        this.docId = value;
    }

    /**
     * Gets the value of the message property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets the value of the message property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setMessage(String value) {
        this.message = value;
    }

    /**
     * Gets the value of the messageDuration property.
     * 
     */
    public int getMessageDuration() {
        return messageDuration;
    }

    /**
     * Sets the value of the messageDuration property.
     * 
     */
    public void setMessageDuration(int value) {
        this.messageDuration = value;
    }

}
